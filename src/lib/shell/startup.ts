import type { Shell } from "./shell";

const INFO_LABEL_WIDTH = 10;

export function infoRow(label: string, value: string): string {
  return `${label.padEnd(INFO_LABEL_WIDTH)}${value}`;
}

function osName(shell: Shell): string {
  try {
    const content = shell.fs.readFile("/etc/os-release", "/");
    const match = content.match(/^PRETTY_NAME="?([^"\n]+)"?$/m);
    return match?.[1] ?? "Linux";
  } catch {
    return "Linux";
  }
}

export function createStartupInfo(shell: Shell): string[] {
  const { state } = shell;

  const rows: [string, string][] = [
    ["User", state.user],
    ["Host", state.hostname],
    ["OS", osName(shell)],
    ["Shell", state.env.SHELL ?? "/bin/sh"],
    ["Directory", state.cwd],
  ];

  return [
    `${state.user}@${state.hostname}`,
    "use `help` to see available commands",
    "------------------------------",
    ...rows.map(([label, value]) => infoRow(label, value)),
  ];
}
