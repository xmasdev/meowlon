import type { Command } from "../types";

export const historyCommand: Command = {
  name: "history",
  description: "Show command history",
  run: ({ state }) => ({
    output: state.history.map((command, index) => `  ${index + 1}  ${command}`),
  }),
};
