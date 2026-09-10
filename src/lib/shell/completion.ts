import type { DirNode } from "./types";
import type { Shell } from "./shell";
import { getChild, listChildren } from "./filesystem";

export interface CompletionCandidate {
  value: string;
  isDirectory: boolean;
}

export interface CompletionResult {
  candidates: CompletionCandidate[];
  tokenStart: number;
  tokenEnd: number;
}

function commandCandidates(shell: Shell, token: string): CompletionCandidate[] {
  return shell.commandNames
    .filter((name) => name.startsWith(token))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({ value: name, isDirectory: false }));
}

function pathCandidates(shell: Shell, token: string): CompletionCandidate[] {
  let dirPart = "";
  let basePart = token;
  let dirInput = shell.state.cwd;

  if (token === "~") {
    dirPart = "~/";
    basePart = "";
    dirInput = shell.state.home;
  } else if (token.startsWith("~/")) {
    const rest = token.slice(2);
    const slash = rest.lastIndexOf("/");
    dirPart = slash >= 0 ? `~/${rest.slice(0, slash + 1)}` : "~/";
    basePart = slash >= 0 ? rest.slice(slash + 1) : rest;
    dirInput =
      slash >= 0 ? `${shell.state.home}/${rest.slice(0, slash)}` : shell.state.home;
  } else {
    const slash = token.lastIndexOf("/");
    dirPart = slash >= 0 ? token.slice(0, slash + 1) : "";
    basePart = slash >= 0 ? token.slice(slash + 1) : token;
    dirInput = dirPart === "" ? shell.state.cwd : dirPart;
  }

  let resolvedDir: DirNode | undefined;
  try {
    const resolved = shell.fs.resolve(dirInput, shell.state.cwd, true);
    if (resolved.node.kind === "dir") resolvedDir = resolved.node;
  } catch {
    return [];
  }

  if (!resolvedDir) return [];
  const dirNode = resolvedDir;

  const includeHidden = basePart.startsWith(".");

  return listChildren(dirNode)
    .filter(
      (name) =>
        (includeHidden || !name.startsWith(".")) && name.startsWith(basePart),
    )
    .map((name) => {
      const child = getChild(dirNode, name);
      const isDirectory = child?.kind === "dir";
      return {
        value: `${dirPart}${name}${isDirectory ? "/" : ""}`,
        isDirectory,
      };
    });
}

export function completeInput(shell: Shell, input: string): CompletionResult {
  const tokenEnd = input.length;
  let tokenStart = input.length;

  if (!/\s$/.test(input)) {
    while (tokenStart > 0 && !/\s/.test(input[tokenStart - 1])) tokenStart -= 1;
  }

  const token = input.slice(tokenStart, tokenEnd);
  const isFirstToken = input.slice(0, tokenStart).trim().length === 0;

  const candidates = isFirstToken
    ? commandCandidates(shell, token)
    : pathCandidates(shell, token);

  return { candidates, tokenStart, tokenEnd };
}
