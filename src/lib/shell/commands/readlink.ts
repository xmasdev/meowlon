import type { Command } from "../types";
import { commandError } from "../errors";

export const readlinkCommand: Command = {
  name: "readlink",
  description: "Print resolved symbolic links",
  usage: "readlink [-f] path",
  run: ({ args, flags, fs, state, emit }) => {
    const target = args[0];
    if (!target) {
      return { output: ["readlink: missing operand"], exitCode: 1 };
    }

    try {
      if (flags.has("f")) {
        try {
          const resolved = fs.resolve(target, state.cwd, true);
          return { output: [resolved.path] };
        } catch {
          // fall through and report the raw link target
        }
      }

      const resolved = fs.resolve(target, state.cwd, false);
      if (resolved.node.kind !== "symlink") {
        return { output: [], exitCode: 1 };
      }

      if (resolved.node.events?.read) emit(resolved.node.events.read);

      const suffix = resolved.node.deleted ? " (deleted)" : "";
      return { output: [`${resolved.node.target}${suffix}`] };
    } catch (error) {
      return { output: [commandError("readlink", error, target)], exitCode: 1 };
    }
  },
};
