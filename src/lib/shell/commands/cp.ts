import type { Command } from "../types";
import { commandError } from "../errors";
import { basename } from "../path";

export const cpCommand: Command = {
  name: "cp",
  description: "Copy files",
  usage: "cp source dest",
  run: ({ args, fs, state, emit }) => {
    if (args.length < 2) {
      return {
        output: ["cp: missing destination file operand"],
        exitCode: 1,
      };
    }

    const [source, destination] = args;

    let sourcePath: string;
    let content: string;
    let executable: string | undefined;
    let copyEvent: string | undefined;

    try {
      const resolved = fs.resolve(source, state.cwd, true);
      if (resolved.node.kind === "dir") {
        return {
          output: [`cp: -r not specified; omitting directory '${source}'`],
          exitCode: 1,
        };
      }

      const opened = fs.open(source, state.cwd);
      sourcePath = resolved.path;
      content = opened.content;
      executable = opened.node.executable;
      copyEvent = opened.node.events?.copy;
    } catch (error) {
      return { output: [commandError("cp", error, source)], exitCode: 1 };
    }

    const options = executable ? { executable } : {};

    try {
      const dest = fs.resolve(destination, state.cwd, false);
      if (dest.node.kind === "dir") {
        const name = basename(sourcePath);
        fs.writeFile(
          `${dest.path}/${name}`,
          "/",
          content,
          state.user,
          state.user,
          options,
        );
        if (copyEvent) emit(copyEvent);
        return {};
      }
    } catch {
      // destination does not exist yet
    }

    try {
      fs.writeFile(destination, state.cwd, content, state.user, state.user, options);
      if (copyEvent) emit(copyEvent);
      return {};
    } catch (error) {
      return { output: [commandError("cp", error, destination)], exitCode: 1 };
    }
  },
};
