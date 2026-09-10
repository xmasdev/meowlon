import type { Command, CommandContext, FsNode } from "../types";
import { commandError } from "../errors";
import { formatDate, formatMode } from "../format";
import { getChild, listChildren } from "../filesystem";
import { basename, dirname } from "../path";

function nodeSize(node: FsNode): number {
  if (node.kind === "dir") return 4096;
  if (node.kind === "symlink") return node.target.length;

  const content =
    typeof node.content === "function" ? node.content() : node.content;
  return new TextEncoder().encode(content).length;
}

function longLine(name: string, node: FsNode): string {
  const { meta } = node;
  const mode = formatMode(meta.mode, node.kind);
  const links = node.kind === "dir" ? 2 : 1;
  const size = String(nodeSize(node)).padStart(5);
  const date = formatDate(meta.mtime);
  const suffix =
    node.kind === "symlink"
      ? ` -> ${node.target}${node.deleted ? " (deleted)" : ""}`
      : "";

  return `${mode} ${links} ${meta.owner} ${meta.group} ${size} ${date} ${name}${suffix}`;
}

export const lsCommand: Command = {
  name: "ls",
  description: "List directory contents",
  usage: "ls [-a] [-A] [-l] [path...]",
  run: (context: CommandContext) => {
    const { args, flags, fs, state } = context;
    const all = flags.has("a");
    const almostAll = all || flags.has("A");
    const long = flags.has("l");
    const targets = args.length > 0 ? args : ["."];

    const output: string[] = [];
    let exitCode = 0;

    targets.forEach((target, targetIndex) => {
      let resolvedPath = target;
      let node: FsNode | undefined;

      try {
        const resolved = fs.resolve(target, state.cwd, !long);
        resolvedPath = resolved.path;
        node = resolved.node;
      } catch {
        try {
          const fallback = fs.resolve(target, state.cwd, false);
          resolvedPath = fallback.path;
          node = fallback.node;
        } catch (error) {
          output.push(commandError("ls", error, target));
          exitCode = 2;
          return;
        }
      }

      if (!node) return;

      if (targets.length > 1) {
        if (targetIndex > 0) output.push("");
        output.push(`${target}:`);
      }

      if (node.kind !== "dir") {
        output.push(long ? longLine(basename(resolvedPath), node) : target);
        return;
      }

      const entries: { name: string; node: FsNode }[] = [];

      if (all) {
        entries.push({ name: ".", node });
        try {
          const parent = fs.resolve(dirname(resolvedPath), state.cwd, true).node;
          if (parent.kind === "dir") entries.push({ name: "..", node: parent });
        } catch {
          // ignore missing parent
        }
      }

      for (const name of listChildren(node)) {
        if (name === "." || name === "..") continue;
        if (name.startsWith(".") && !almostAll) continue;
        const child = getChild(node, name);
        if (child) entries.push({ name, node: child });
      }

      if (entries.length === 0) return;

      if (long) {
        output.push(...entries.map((entry) => longLine(entry.name, entry.node)));
      } else {
        output.push(entries.map((entry) => entry.name).join("  "));
      }
    });

    return { output, exitCode };
  },
};
