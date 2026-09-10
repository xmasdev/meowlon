import type { Command, ShellState } from "../types";

function environmentLines(state: ShellState): string[] {
  return Object.entries(state.env)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`);
}

export const envCommand: Command = {
  name: "env",
  description: "Display environment variables",
  run: ({ state }) => ({ output: environmentLines(state) }),
};

export const exportCommand: Command = {
  name: "export",
  description: "Set or display environment variables",
  usage: "export [NAME=value ...]",
  run: ({ args, state }) => {
    if (args.length === 0) {
      return { output: environmentLines(state) };
    }

    const output: string[] = [];

    for (const arg of args) {
      const separator = arg.indexOf("=");
      if (separator === -1) {
        output.push(`export: ${arg}: not a valid identifier`);
        continue;
      }
      state.env[arg.slice(0, separator)] = arg.slice(separator + 1);
    }

    return { output };
  },
};
