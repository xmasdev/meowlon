import type { Command } from "../types";
import { commandError } from "../errors";

export const catCommand: Command = {
  name: "cat",
  description: "Concatenate and print files",
  usage: "cat path...",
  run: ({ args, fs, state, emit }) => {
    if (args.length === 0) {
      return { output: ["usage: cat path..."], exitCode: 1 };
    }

    const output: string[] = [];
    let exitCode = 0;

    for (const target of args) {
      try {
        const { node, content } = fs.open(target, state.cwd);
        output.push(...content.replace(/\n$/, "").split("\n"));
        if (node.events?.read) emit(node.events.read);
      } catch (error) {
        output.push(commandError("cat", error, target));
        exitCode = 1;
      }
    }

    return { output, exitCode };
  },
};
