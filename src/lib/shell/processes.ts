import type { ProcessInfo } from "./types";

export class ProcessTable {
  private readonly byPid = new Map<number, ProcessInfo>();

  constructor(initial: ProcessInfo[] = []) {
    for (const process of initial) this.add(process);
  }

  add(process: ProcessInfo): void {
    this.byPid.set(process.pid, process);
  }

  get(pid: number): ProcessInfo | undefined {
    return this.byPid.get(pid);
  }

  list(): ProcessInfo[] {
    return [...this.byPid.values()].sort((a, b) => a.pid - b.pid);
  }

  remove(pid: number): void {
    this.byPid.delete(pid);
  }
}
