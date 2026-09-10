const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

interface RateState {
  hits: Map<string, number[]>;
}

const globalRef = globalThis as typeof globalThis & {
  __meowlonRateLimit?: RateState;
};

function state(): RateState {
  if (!globalRef.__meowlonRateLimit) {
    globalRef.__meowlonRateLimit = { hits: new Map() };
  }
  return globalRef.__meowlonRateLimit;
}

export function allowSubmission(key: string): boolean {
  const now = Date.now();
  const hits = state().hits;
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);
  return true;
}
