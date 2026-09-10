import type { Command } from "../types";

export const clearCommand: Command = {
  name: "clear",
  description: "Clear the terminal screen",
  run: () => ({ clear: true }),
};
