import type {
  DirNode,
  FileNode,
  FsMetadata,
  FsNode,
  ProcessInfo,
} from "./types";
import type { ProcessTable } from "./processes";

const DEFAULT_MTIME = new Date("2026-01-01T00:00:00Z");

const ROOT_META: FsMetadata = {
  mode: 0o555,
  owner: "root",
  group: "root",
  mtime: DEFAULT_MTIME,
};

function file(name: string, content: string | (() => string)): FileNode {
  return {
    kind: "file",
    name,
    content,
    meta: { ...ROOT_META, mode: 0o444 },
  };
}

function processMeta(owner: string): FsMetadata {
  return {
    mode: 0o555,
    owner,
    group: owner,
    mtime: DEFAULT_MTIME,
  };
}

function statusText(process: ProcessInfo, comm: string): string {
  const uid = process.user === "root" ? "0" : "1000";
  return [
    `Name:\t${comm}`,
    `State:\t${process.state} (sleeping)`,
    `Pid:\t${process.pid}`,
    `PPid:\t${process.ppid}`,
    `Uid:\t${uid}\t${uid}\t${uid}\t${uid}`,
    `Gid:\t1000\t1000\t1000\t1000`,
  ].join("\n");
}

function mapsText(process: ProcessInfo): string {
  const deleted = process.executableDeleted ? " (deleted)" : "";
  return [
    `00400000-00452000 r-xp 00000000 08:01 1234567  ${process.executablePath}${deleted}`,
    `7ffd00000000-7ffd02100000 rw-p 00000000 00:00 0  [stack]`,
  ].join("\n");
}

function processDirectory(process: ProcessInfo): DirNode {
  const comm = process.command.split("/").pop() ?? process.command;

  const children: Record<string, FsNode> = {
    cmdline: file("cmdline", () => process.command.split(" ").join("\0")),
    comm: file("comm", `${comm}\n`),
    status: file("status", () => statusText(process, comm)),
    environ: file("environ", () =>
      Object.entries(process.environment)
        .map(([key, value]) => `${key}=${value}`)
        .join("\0"),
    ),
    maps: file("maps", () => mapsText(process)),
    cwd: {
      kind: "symlink",
      name: "cwd",
      target: process.cwd,
      meta: processMeta(process.user),
    },
    exe: {
      kind: "symlink",
      name: "exe",
      target: process.executablePath,
      deleted: process.executableDeleted,
      content: process.executableContent,
      executable: process.executableProgram,
      events: process.executableEvents,
      meta: processMeta(process.user),
    },
  };

  return {
    kind: "dir",
    name: String(process.pid),
    meta: processMeta(process.user),
    children,
  };
}

export function createProcDirectory(processes: ProcessTable): DirNode {
  return {
    kind: "dir",
    name: "proc",
    meta: ROOT_META,
    children: {
      version: file(
        "version",
        "Linux version 6.12.1-arch1-1 (linux@arch) (gcc 14.2.1) #1 SMP PREEMPT_DYNAMIC\n",
      ),
    },
    list: () => processes.list().map((process) => String(process.pid)),
    resolve: (name) => {
      if (!/^\d+$/.test(name)) return undefined;
      const process = processes.get(Number(name));
      return process ? processDirectory(process) : undefined;
    },
  };
}
