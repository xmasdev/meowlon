import type { Command } from "../types";

export const pwdCommand: Command = {
  name: "pwd",
  description: "Print the current working directory",
  run: ({ state }) => ({ output: [state.cwd] }),
};
