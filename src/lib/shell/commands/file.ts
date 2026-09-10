import type { Command, FsNode } from "../types";
import { commandError } from "../errors";

function isText(content: string): boolean {
  for (const char of content) {
    const code = char.charCodeAt(0);
    if (code === 9 || code === 10 || code === 13) continue;
    if (code < 32 || code > 126) return false;
  }
  return true;
}

function describe(node: FsNode): string {
  if (node.kind === "dir") return "directory";
  if (node.kind === "symlink") {
    return `symbolic link to ${node.target}${node.deleted ? " (deleted)" : ""}`;
  }

  if (node.executable) return "ELF 64-bit LSB executable";

  const content =
    typeof node.content === "function" ? node.content() : node.content;
  return isText(content) ? "ASCII text" : "data";
}

export const fileCommand: Command = {
  name: "file",
  description: "Determine file type",
  usage: "file path...",
  run: ({ args, fs, state }) => {
    if (args.length === 0) {
      return { output: ["usage: file path..."], exitCode: 1 };
    }

    const output: string[] = [];
    let exitCode = 0;

    for (const target of args) {
      try {
        const resolved = fs.resolve(target, state.cwd, false);
        output.push(`${target}: ${describe(resolved.node)}`);
      } catch (error) {
        output.push(commandError("file", error, target));
        exitCode = 1;
      }
    }

    return { output, exitCode };
  },
};
