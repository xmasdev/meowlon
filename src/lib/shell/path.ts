export function normalizePath(path: string): string {
  const stack: string[] = [];

  for (const segment of path.split("/")) {
    if (segment === "" || segment === ".") continue;
    if (segment === "..") {
      stack.pop();
      continue;
    }
    stack.push(segment);
  }

  return `/${stack.join("/")}`;
}

export function joinPath(base: string, path: string): string {
  if (path.startsWith("/")) return normalizePath(path);
  return normalizePath(`${base}/${path}`);
}

export function dirname(path: string): string {
  const normalized = normalizePath(path);
  if (normalized === "/") return "/";
  const index = normalized.lastIndexOf("/");
  return index <= 0 ? "/" : normalized.slice(0, index);
}

export function basename(path: string): string {
  const normalized = normalizePath(path);
  if (normalized === "/") return "/";
  return normalized.slice(normalized.lastIndexOf("/") + 1);
}

export function splitPath(path: string): string[] {
  return path.split("/").filter((segment) => segment.length > 0);
}
