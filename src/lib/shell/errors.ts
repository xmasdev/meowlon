export type FsErrorCode =
  | "ENOENT"
  | "ENOTDIR"
  | "EISDIR"
  | "EEXIST"
  | "ENOTEMPTY"
  | "ELOOP";

export class FsError extends Error {
  readonly code: FsErrorCode;
  readonly path: string;

  constructor(code: FsErrorCode, path = "") {
    super(code);
    this.name = "FsError";
    this.code = code;
    this.path = path;
  }
}

const DESCRIPTIONS: Record<FsErrorCode, string> = {
  ENOENT: "No such file or directory",
  ENOTDIR: "Not a directory",
  EISDIR: "Is a directory",
  EEXIST: "File exists",
  ENOTEMPTY: "Directory not empty",
  ELOOP: "Too many levels of symbolic links",
};

export function commandError(
  command: string,
  error: unknown,
  path = "",
): string {
  if (error instanceof FsError) {
    const target = error.path || path;
    const prefix = target ? `${target}: ` : "";
    return `${command}: ${prefix}${DESCRIPTIONS[error.code]}`;
  }

  const message = error instanceof Error ? error.message : String(error);
  return `${command}: ${message}`;
}
