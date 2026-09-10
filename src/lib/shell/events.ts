import type { PuzzleEvent } from "./types";

export type PuzzleEventListener = (event: PuzzleEvent) => void;

export class PuzzleEventBus {
  private readonly log: PuzzleEvent[] = [];
  private readonly listeners = new Set<PuzzleEventListener>();

  emit(type: string, data?: Record<string, unknown>): PuzzleEvent {
    const event: PuzzleEvent = { type, at: Date.now(), data };
    this.log.push(event);

    for (const listener of this.listeners) listener(event);

    return event;
  }

  subscribe(listener: PuzzleEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  get length(): number {
    return this.log.length;
  }

  since(index: number): PuzzleEvent[] {
    return this.log.slice(index);
  }

  get history(): readonly PuzzleEvent[] {
    return this.log;
  }
}
