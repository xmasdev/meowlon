import type { Command } from "../types";

export const echoCommand: Command = {
  name: "echo",
  description: "Display a line of text",
  usage: "echo [text...]",
  run: ({ args }) => ({ output: [args.join(" ")] }),
};
