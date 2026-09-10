export interface ExplorerRecord {
  id: string;
  username: string;
  note: string;
  createdAt: string;
}

export interface ExplorerStore {
  add(input: { username: string; note: string }): Promise<ExplorerRecord>;
  list(): Promise<ExplorerRecord[]>;
}

const MAX_ENTRIES = 500;

interface MemoryState {
  explorers: ExplorerRecord[];
}

const globalRef = globalThis as typeof globalThis & {
  __meowlonExplorerStore?: MemoryState;
};

function memoryState(): MemoryState {
  if (!globalRef.__meowlonExplorerStore) {
    globalRef.__meowlonExplorerStore = { explorers: [] };
  }
  return globalRef.__meowlonExplorerStore;
}

class MemoryExplorerStore implements ExplorerStore {
  async add(input: { username: string; note: string }): Promise<ExplorerRecord> {
    const explorer = createRecord(input);
    const state = memoryState();
    state.explorers.push(explorer);

    if (state.explorers.length > MAX_ENTRIES) {
      state.explorers.splice(0, state.explorers.length - MAX_ENTRIES);
    }

    return explorer;
  }

  async list(): Promise<ExplorerRecord[]> {
    return [...memoryState().explorers];
  }
}

interface RedisConfig {
  url: string;
  token: string;
}

const REDIS_KEY = "meowlon:explorers";

function redisConfig(): RedisConfig | null {
  const url =
    process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
}

class RedisExplorerStore implements ExplorerStore {
  constructor(private readonly config: RedisConfig) {}

  private async command(command: unknown[]): Promise<unknown> {
    const response = await fetch(this.config.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Explorer store request failed.");
    }

    const data = (await response.json()) as {
      result?: unknown;
      error?: string;
    };

    if (data.error) throw new Error(data.error);
    return data.result;
  }

  async add(input: { username: string; note: string }): Promise<ExplorerRecord> {
    const explorer = createRecord(input);
    await this.command(["RPUSH", REDIS_KEY, JSON.stringify(explorer)]);
    await this.command(["LTRIM", REDIS_KEY, -MAX_ENTRIES, -1]);
    return explorer;
  }

  async list(): Promise<ExplorerRecord[]> {
    const result = await this.command(["LRANGE", REDIS_KEY, 0, -1]);
    if (!Array.isArray(result)) return [];

    return result
      .map((item) => parseRecord(item))
      .filter((item): item is ExplorerRecord => item !== null);
  }
}

function createRecord(input: {
  username: string;
  note: string;
}): ExplorerRecord {
  return {
    id: crypto.randomUUID(),
    username: input.username,
    note: input.note,
    createdAt: new Date().toISOString(),
  };
}

function parseRecord(value: unknown): ExplorerRecord | null {
  try {
    const parsed = JSON.parse(String(value)) as Partial<ExplorerRecord>;
    if (
      typeof parsed.username === "string" &&
      typeof parsed.note === "string" &&
      typeof parsed.createdAt === "string"
    ) {
      return {
        id: typeof parsed.id === "string" ? parsed.id : crypto.randomUUID(),
        username: parsed.username,
        note: parsed.note,
        createdAt: parsed.createdAt,
      };
    }
  } catch {
    return null;
  }
  return null;
}

let store: ExplorerStore | undefined;

export function getExplorerStore(): ExplorerStore {
  if (!store) {
    const config = redisConfig();

    if (config) {
      store = new RedisExplorerStore(config);
    } else {
      if (process.env.NODE_ENV === "production") {
        console.warn(
          "[explorers] No database configured; falling back to an in-memory store. " +
            "Explorer submissions will not persist across instances. " +
            "Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_URL and KV_REST_API_TOKEN).",
        );
      }
      store = new MemoryExplorerStore();
    }
  }

  return store;
}
