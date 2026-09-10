import type { Command } from "../types";

export const helpCommand: Command = {
  name: "help",
  description: "List available commands",
  run: ({ registry }) => {
    const lines = [...registry.values()]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((command) => `  ${command.name.padEnd(10)} ${command.description}`);

    return { output: ["Available commands:", ...lines] };
  },
};
