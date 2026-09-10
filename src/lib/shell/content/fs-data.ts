import type {
  DirNode,
  FileNode,
  FsMetadata,
  FsNode,
} from "../types";
import type { ProcessTable } from "../processes";
import { createProcDirectory } from "../proc";
import {
  ABOUT_README,
  CONTACT_README,
  EXPERIENCE_README,
  HOME_README,
  PROJECTS,
  PROJECTS_README,
  SKILLS_README,
} from "./portfolio";
import { DOT_SECRETS, PuzzleEvent, SECRETS_TXT } from "./puzzle";

const DEFAULT_MTIME = new Date("2026-01-01T00:00:00Z");

function metadata(mode: number, owner = "root", group = "root"): FsMetadata {
  return { mode, owner, group, mtime: DEFAULT_MTIME };
}

function dir(
  name: string,
  children: Record<string, FsNode>,
  mode = 0o755,
  owner = "root",
  group = "root",
): DirNode {
  return { kind: "dir", name, children, meta: metadata(mode, owner, group) };
}

function file(
  name: string,
  content: string,
  mode = 0o644,
  owner = "root",
  group = "root",
): FileNode {
  return { kind: "file", name, content, meta: metadata(mode, owner, group) };
}

function userDir(name: string, children: Record<string, FsNode>): DirNode {
  return dir(name, children, 0o755, "melon", "melon");
}

function userFile(name: string, content: string): FileNode {
  return file(name, content, 0o644, "melon", "melon");
}

function readme(content: string): Record<string, FsNode> {
  return { "README.md": userFile("README.md", content) };
}

function buildProjects(): DirNode {
  const children: Record<string, FsNode> = {
    "README.md": userFile("README.md", PROJECTS_README),
  };

  for (const [name, content] of Object.entries(PROJECTS)) {
    children[name] = userDir(name, readme(content));
  }

  return userDir("projects", children);
}

export function createRootFilesystem(processes: ProcessTable): DirNode {
  return dir("", {
    bin: dir("bin", {}),
    dev: dir("dev", {}),
    etc: dir("etc", {
      hostname: file("hostname", "arch\n"),
      "os-release": file(
        "os-release",
        'NAME="Arch Linux"\nPRETTY_NAME="Arch Linux"\nID=arch\nID_LIKE=archlinux\n',
      ),
    }),
    home: dir("home", {
      melon: userDir("melon", {
        about: userDir("about", readme(ABOUT_README)),
        projects: buildProjects(),
        experience: userDir("experience", readme(EXPERIENCE_README)),
        skills: userDir("skills", readme(SKILLS_README)),
        contact: userDir("contact", readme(CONTACT_README)),
        ".bashrc": userFile(".bashrc", "# ~/.bashrc\n"),
        "README.md": userFile("README.md", HOME_README),
      }),
    }),
    lib: dir("lib", {}),
    opt: dir("opt", {}),
    proc: createProcDirectory(processes),
    tmp: dir("tmp", {}, 0o1777),
    usr: dir("usr", {
      bin: dir("bin", {}),
      lib: dir("lib", {}),
    }),
    var: dir("var", {
      log: dir("log", {}),
    }),
    "secrets.txt": {
      kind: "file",
      name: "secrets.txt",
      content: SECRETS_TXT,
      events: { read: PuzzleEvent.RootSecretDiscovered },
      meta: metadata(0o644),
    },
    ".secrets": {
      kind: "file",
      name: ".secrets",
      content: DOT_SECRETS,
      events: { read: PuzzleEvent.HiddenSecretDiscovered },
      meta: metadata(0o644),
    },
  });
}
