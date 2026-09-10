import type {
  Command,
  CommandContext,
  CommandResult,
  ExplorerApi,
  ParsedCommand,
  Program,
  ProgramContext,
  PuzzleEvent,
  ShellIo,
  ShellState,
} from "./types";
import { VirtualFileSystem } from "./filesystem";
import { ProcessTable } from "./processes";
import { PuzzleEventBus } from "./events";
import { parseCommand } from "./parser";
import { createCommandRegistry } from "./commands";
import { createProgramRegistry } from "./programs";
import { createRootFilesystem } from "./content/fs-data";
import { createInitialProcesses } from "./content/process-data";

export interface ShellResult {
  output: string[];
  events: PuzzleEvent[];
  clear: boolean;
  exitCode: number;
}

export interface ShellOptions {
  explorerApi?: ExplorerApi;
}

type CommonContext = Omit<CommandContext, "registry">;

export function createShellState(): ShellState {
  return {
    user: "melon",
    hostname: "arch",
    cwd: "/home/melon",
    home: "/home/melon",
    history: [],
    env: {
      USER: "melon",
      HOME: "/home/melon",
      HOSTNAME: "arch",
      SHELL: "/usr/bin/bash",
      PWD: "/home/melon",
      OLDPWD: "/home/melon",
      PATH: "/usr/local/sbin:/usr/local/bin:/usr/bin:/bin",
      TERM: "xterm-256color",
      LANG: "en_US.UTF-8",
    },
  };
}

function expandArg(arg: string, state: ShellState): string {
  let value = arg;

  if (value === "~") return state.home;
  if (value.startsWith("~/")) value = `${state.home}${value.slice(1)}`;

  return value.replace(
    /\$\{([A-Za-z_][A-Za-z0-9_]*)\}|\$([A-Za-z_][A-Za-z0-9_]*)/g,
    (_match, braced: string | undefined, plain: string | undefined) =>
      state.env[braced ?? plain ?? ""] ?? "",
  );
}

function looksLikePath(name: string): boolean {
  return (
    name.includes("/") || name.startsWith(".") || name.startsWith("~")
  );
}

export class Shell {
  readonly fs: VirtualFileSystem;
  readonly processes: ProcessTable;
  readonly events = new PuzzleEventBus();
  readonly state: ShellState;

  private readonly commands: Map<string, Command>;
  private readonly programs: Map<string, Program>;
  private readonly explorerApi?: ExplorerApi;
  private pendingResolve: ((value: string) => void) | null = null;

  constructor(options: ShellOptions = {}) {
    this.processes = new ProcessTable(createInitialProcesses());
    this.fs = new VirtualFileSystem(createRootFilesystem(this.processes));
    this.state = createShellState();
    this.commands = createCommandRegistry();
    this.programs = createProgramRegistry();
    this.explorerApi = options.explorerApi;
  }

  get commandNames(): string[] {
    return [...this.commands.keys()];
  }

  get awaitingInput(): boolean {
    return this.pendingResolve !== null;
  }

  provideInput(value: string): boolean {
    const resolve = this.pendingResolve;
    if (!resolve) return false;
    this.pendingResolve = null;
    resolve(value);
    return true;
  }

  async run(raw: string, io: ShellIo = {}): Promise<ShellResult> {
    const input = raw.trim();
    const output: string[] = [];

    const emitOutput = (lines: string[]) => {
      if (lines.length === 0) return;
      output.push(...lines);
      io.onOutput?.(lines);
    };

    if (input.length === 0) {
      return { output: [], events: [], clear: false, exitCode: 0 };
    }

    this.state.history.push(input);

    const parsed = parseCommand(input);
    if (!parsed) {
      return { output: [], events: [], clear: false, exitCode: 0 };
    }

    const eventStart = this.events.length;
    const common: CommonContext = {
      fs: this.fs,
      processes: this.processes,
      state: this.state,
      events: this.events,
      emit: (type, data) => {
        this.events.emit(type, data);
      },
      args: parsed.args.map((arg) => expandArg(arg, this.state)),
      flags: parsed.flags,
      raw: input,
    };

    const command = this.commands.get(parsed.name);
    if (command) {
      let result: CommandResult;
      try {
        result = command.run({ ...common, registry: this.commands }) ?? {};
      } catch (error) {
        result = {
          output: [
            `${parsed.name}: ${error instanceof Error ? error.message : String(error)}`,
          ],
          exitCode: 1,
        };
      }

      emitOutput(result.output ?? []);

      return {
        output,
        events: this.events.since(eventStart),
        clear: result.clear ?? false,
        exitCode: result.exitCode ?? 0,
      };
    }

    if (looksLikePath(parsed.name)) {
      return this.runProgram(parsed, common, io, emitOutput, eventStart, output);
    }

    emitOutput([`bash: ${parsed.name}: command not found`]);

    return {
      output,
      events: this.events.since(eventStart),
      clear: false,
      exitCode: 127,
    };
  }

  private async runProgram(
    parsed: ParsedCommand,
    common: CommonContext,
    io: ShellIo,
    emitOutput: (lines: string[]) => void,
    eventStart: number,
    output: string[],
  ): Promise<ShellResult> {
    const name = parsed.name;

    let node;
    try {
      node = this.fs.resolve(name, this.state.cwd, true).node;
    } catch {
      emitOutput([`bash: ${name}: No such file or directory`]);
      return this.programResult(output, eventStart, 127);
    }

    if (node.kind === "dir") {
      emitOutput([`bash: ${name}: Is a directory`]);
      return this.programResult(output, eventStart, 126);
    }

    const programId = node.executable;
    if (!programId) {
      emitOutput([`bash: ${name}: Permission denied`]);
      return this.programResult(output, eventStart, 126);
    }

    const program = this.programs.get(programId);
    if (!program) {
      emitOutput([`bash: ${name}: cannot execute binary file`]);
      return this.programResult(output, eventStart, 126);
    }

    if (node.events?.execute) common.emit(node.events.execute);

    const programContext: ProgramContext = {
      ...common,
      explorerApi: this.explorerApi,
      print: (lines) => emitOutput(typeof lines === "string" ? [lines] : lines),
      read: (prompt) => this.readInput(prompt, io),
    };

    try {
      await program.run(programContext);
    } catch (error) {
      emitOutput([
        `${name}: ${error instanceof Error ? error.message : String(error)}`,
      ]);
      return this.programResult(output, eventStart, 1);
    }

    return this.programResult(output, eventStart, 0);
  }

  private programResult(
    output: string[],
    eventStart: number,
    exitCode: number,
  ): ShellResult {
    return {
      output,
      events: this.events.since(eventStart),
      clear: false,
      exitCode,
    };
  }

  private readInput(prompt: string, io: ShellIo): Promise<string> {
    io.onPrompt?.(prompt);

    return new Promise<string>((resolve) => {
      this.pendingResolve = (value) => {
        io.onPrompt?.(null);
        resolve(value);
      };
    });
  }
}
