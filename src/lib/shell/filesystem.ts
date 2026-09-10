import type {
  DirNode,
  FileNode,
  FsMetadata,
  FsNode,
  FsNodeEvents,
  ResolvedPath,
  SymlinkNode,
} from "./types";
import { FsError } from "./errors";
import { basename, dirname, joinPath, normalizePath } from "./path";

export function getChild(dir: DirNode, name: string): FsNode | undefined {
  if (name === ".") return dir;
  return dir.children[name] ?? dir.resolve?.(name);
}

export function listChildren(dir: DirNode): string[] {
  const names = new Set(Object.keys(dir.children));
  for (const name of dir.list?.() ?? []) names.add(name);
  return [...names].sort((a, b) => a.localeCompare(b));
}

export function readNodeContent(
  node: FileNode | SymlinkNode,
): string | undefined {
  if (node.content === undefined) return undefined;
  return typeof node.content === "function" ? node.content() : node.content;
}

export class VirtualFileSystem {
  readonly root: DirNode;

  constructor(root: DirNode) {
    this.root = root;
  }

  resolve(input: string, cwd: string, followFinal = true): ResolvedPath {
    const path = input.length === 0 ? cwd : input;
    const absolute = path.startsWith("/") ? path : joinPath(cwd, path);

    let queue = absolute.split("/").filter((segment) => segment.length > 0);
    let stack: { name: string; node: FsNode }[] = [];
    let guard = 0;

    const canonical = (): string => `/${stack.map((entry) => entry.name).join("/")}`;

    const currentDir = (): DirNode => {
      if (stack.length === 0) return this.root;
      const node = stack[stack.length - 1].node;
      if (node.kind !== "dir") {
        throw new FsError("ENOTDIR", canonical());
      }
      return node;
    };

    while (queue.length > 0) {
      if (guard++ > 256) {
        throw new FsError("ELOOP", absolute);
      }

      const segment = queue.shift() as string;

      if (segment === ".") continue;
      if (segment === "..") {
        stack.pop();
        continue;
      }

      const dir = currentDir();
      const child = getChild(dir, segment);
      if (!child) throw new FsError("ENOENT", joinPath(canonical(), segment));

      const isLast = queue.length === 0;

      if (child.kind === "symlink" && (!isLast || followFinal)) {
        if (isLast && child.content !== undefined && child.deleted) {
          stack.push({ name: segment, node: child });
          return { node: child, path: canonical() };
        }

        const target = child.target.startsWith("/")
          ? child.target
          : joinPath(canonical(), child.target);

        queue = [...target.split("/").filter(Boolean), ...queue];
        stack = [];
        continue;
      }

      stack.push({ name: segment, node: child });
    }

    const node = stack.length === 0 ? this.root : stack[stack.length - 1].node;
    return { node, path: canonical() };
  }

  exists(input: string, cwd: string): boolean {
    try {
      this.resolve(input, cwd, true);
      return true;
    } catch {
      return false;
    }
  }

  isDirectory(input: string, cwd: string): boolean {
    try {
      return this.resolve(input, cwd, true).node.kind === "dir";
    } catch {
      return false;
    }
  }

  list(input: string, cwd: string): string[] {
    const resolved = this.resolve(input, cwd, true);
    if (resolved.node.kind !== "dir") {
      throw new FsError("ENOTDIR", input);
    }
    return listChildren(resolved.node);
  }

  readFile(input: string, cwd: string): string {
    return this.open(input, cwd).content;
  }

  open(
    input: string,
    cwd: string,
  ): { node: FileNode | SymlinkNode; content: string } {
    const resolved = this.resolve(input, cwd, false);
    const node = resolved.node;

    if (node.kind === "dir") throw new FsError("EISDIR", input);
    if (node.kind === "file") {
      return { node, content: readNodeContent(node) ?? "" };
    }

    try {
      const target = this.resolve(node.target, dirname(resolved.path), true);
      if (target.node.kind === "file") {
        return { node: target.node, content: readNodeContent(target.node) ?? "" };
      }
      if (target.node.kind === "dir") throw new FsError("EISDIR", input);
    } catch (error) {
      if (error instanceof FsError && error.code === "EISDIR") throw error;
    }

    const content = readNodeContent(node);
    if (content !== undefined) return { node, content };

    throw new FsError("ENOENT", input);
  }

  writeFile(
    input: string,
    cwd: string,
    content: string,
    owner: string,
    group: string,
    options: { executable?: string; events?: FsNodeEvents } = {},
  ): string {
    const full = input.startsWith("/") ? normalizePath(input) : joinPath(cwd, input);
    const parentPath = dirname(full);
    const name = basename(full);

    if (name === "/" || name.length === 0) {
      throw new FsError("EISDIR", input);
    }

    const parent = this.resolve(parentPath, cwd, true).node;
    if (parent.kind !== "dir") throw new FsError("ENOTDIR", parentPath);

    const existing = getChild(parent, name);
    if (existing?.kind === "dir") throw new FsError("EISDIR", input);

    const meta: FsMetadata = {
      mode: options.executable ? 0o755 : 0o644,
      owner,
      group,
      mtime: new Date(),
    };
    parent.children[name] = {
      kind: "file",
      name,
      content,
      executable: options.executable,
      events: options.events,
      meta,
    };

    return full;
  }
}
