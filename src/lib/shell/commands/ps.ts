import type { Command, ProcessInfo } from "../types";

const AUX_HEADER =
  "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND";
const DEFAULT_HEADER = "    PID TTY          TIME CMD";

function formatAux(process: ProcessInfo): string {
  return [
    process.user.padEnd(8),
    String(process.pid).padStart(4),
    (process.cpu ?? 0).toFixed(1).padStart(4),
    (process.mem ?? 0).toFixed(1).padStart(4),
    String(process.vsz ?? 0).padStart(7),
    String(process.rss ?? 0).padStart(5),
    (process.tty ?? "?").padEnd(8),
    (process.state ?? "S").padEnd(4),
    (process.start ?? "00:00").padEnd(7),
    (process.time ?? "0:00").padStart(5),
    process.command,
  ].join(" ");
}

function formatDefault(process: ProcessInfo): string {
  return [
    String(process.pid).padStart(7),
    (process.tty ?? "?").padEnd(8),
    (process.time ?? "0:00").padStart(8),
    process.command,
  ].join(" ");
}

export const psCommand: Command = {
  name: "ps",
  description: "Report a snapshot of current processes",
  usage: "ps [aux]",
  run: ({ args, flags, processes, state, emit }) => {
    const all =
      args.includes("aux") ||
      args.includes("ax") ||
      args.includes("-e") ||
      flags.has("e");

    const list = processes
      .list()
      .filter((process) => all || process.user === state.user);

    for (const process of list) {
      if (process.events?.listed) emit(process.events.listed);
    }

    if (all) {
      return {
        output: [AUX_HEADER, ...list.map((process) => formatAux(process))],
      };
    }

    return {
      output: [DEFAULT_HEADER, ...list.map((process) => formatDefault(process))],
    };
  },
};
