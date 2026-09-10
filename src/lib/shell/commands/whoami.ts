import type { Command } from "../types";

export const whoamiCommand: Command = {
  name: "whoami",
  description: "Print the current user name",
  run: ({ state }) => ({ output: [state.user] }),
};
