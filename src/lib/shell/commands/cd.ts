import type { Command } from "../types";
import { commandError } from "../errors";

export const cdCommand: Command = {
  name: "cd",
  description: "Change the current directory",
  usage: "cd [directory]",
  run: ({ args, fs, state }) => {
    let target = args[0] ?? state.home;

    if (target === "~") target = state.home;
    else if (target.startsWith("~/")) target = `${state.home}${target.slice(1)}`;
    if (target === "-") target = state.env.OLDPWD ?? state.home;

    try {
      const resolved = fs.resolve(target, state.cwd, true);
      if (resolved.node.kind !== "dir") {
        return { output: [`cd: ${target}: Not a directory`], exitCode: 1 };
      }

      state.env.OLDPWD = state.cwd;
      state.cwd = resolved.path;
      state.env.PWD = resolved.path;

      return {};
    } catch (error) {
      return { output: [commandError("cd", error, target)], exitCode: 1 };
    }
  },
};
