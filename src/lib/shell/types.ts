import type { VirtualFileSystem } from "./filesystem";
import type { ProcessTable } from "./processes";
import type { PuzzleEventBus } from "./events";

export type NodeKind = "file" | "dir" | "symlink";

export interface FsMetadata {
  mode: number;
  owner: string;
  group: string;
  mtime: Date;
}

export interface FsNodeEvents {
  read?: string;
  execute?: string;
  copy?: string;
}

export interface FileNode {
  kind: "file";
  name: string;
  meta: FsMetadata;
  content: string | (() => string);
  executable?: string;
  events?: FsNodeEvents;
}

export interface DirNode {
  kind: "dir";
  name: string;
  meta: FsMetadata;
  children: Record<string, FsNode>;
  resolve?: (name: string) => FsNode | undefined;
  list?: () => string[];
}

export interface SymlinkNode {
  kind: "symlink";
  name: string;
  meta: FsMetadata;
  target: string;
  deleted?: boolean;
  content?: string | (() => string);
  executable?: string;
  events?: FsNodeEvents;
}

export type FsNode = FileNode | DirNode | SymlinkNode;

export interface ResolvedPath {
  node: FsNode;
  path: string;
}

export interface ProcessInfo {
  pid: number;
  ppid: number;
  user: string;
  command: string;
  executablePath: string;
  executableDeleted?: boolean;
  executableContent?: string | (() => string);
  executableProgram?: string;
  executableEvents?: FsNodeEvents;
  state: string;
  cwd: string;
  environment: Record<string, string>;
  cpu?: number;
  mem?: number;
  vsz?: number;
  rss?: number;
  tty?: string;
  start?: string;
  time?: string;
  metadata?: Record<string, string>;
  events?: { listed?: string };
}

export interface PuzzleEvent {
  type: string;
  at: number;
  data?: Record<string, unknown>;
}

export interface ShellState {
  user: string;
  hostname: string;
  cwd: string;
  home: string;
  history: string[];
  env: Record<string, string>;
}

export interface ParsedCommand {
  raw: string;
  name: string;
  args: string[];
  flags: Set<string>;
}

export interface CommandResult {
  output?: string[];
  clear?: boolean;
  exitCode?: number;
}

export interface CommandContext {
  fs: VirtualFileSystem;
  processes: ProcessTable;
  state: ShellState;
  events: PuzzleEventBus;
  registry: Map<string, Command>;
  emit: (type: string, data?: Record<string, unknown>) => void;
  args: string[];
  flags: Set<string>;
  raw: string;
}

export interface Command {
  name: string;
  description: string;
  usage?: string;
  run: (context: CommandContext) => CommandResult | void;
}

export interface Explorer {
  username: string;
  note: string;
  createdAt: string;
}

export interface ExplorerApi {
  submit(input: { username: string; note: string }): Promise<Explorer>;
  list(): Promise<Explorer[]>;
}

export interface ProgramContext {
  fs: VirtualFileSystem;
  processes: ProcessTable;
  state: ShellState;
  events: PuzzleEventBus;
  emit: (type: string, data?: Record<string, unknown>) => void;
  args: string[];
  flags: Set<string>;
  raw: string;
  explorerApi?: ExplorerApi;
  print: (lines: string[] | string) => void;
  read: (prompt: string) => Promise<string>;
}

export interface Program {
  name: string;
  run: (context: ProgramContext) => Promise<void> | void;
}

export interface ShellIo {
  onOutput?: (lines: string[]) => void;
  onPrompt?: (prompt: string | null) => void;
}
