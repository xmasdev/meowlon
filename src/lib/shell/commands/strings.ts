import type { Command } from "../types";
import { commandError } from "../errors";

export const stringsCommand: Command = {
  name: "strings",
  description: "Print printable strings from a file",
  usage: "strings path",
  run: ({ args, fs, state }) => {
    const target = args[0];
    if (!target) {
      return { output: ["strings: missing operand"], exitCode: 1 };
    }

    try {
      const content = fs.readFile(target, state.cwd);
      return { output: content.match(/[\x20-\x7e]{4,}/g) ?? [] };
    } catch (error) {
      return { output: [commandError("strings", error, target)], exitCode: 1 };
    }
  },
};
