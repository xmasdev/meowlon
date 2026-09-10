import type { Explorer, ExplorerApi } from "@/lib/shell/types";

async function parseJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export const explorerApi: ExplorerApi = {
  async submit({ username, note }) {
    const response = await fetch("/api/explorers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, note }),
    });

    const data = (await parseJson(response)) as {
      explorer?: Explorer;
      error?: string;
    } | null;

    if (!response.ok || !data?.explorer) {
      throw new Error(data?.error ?? "Unable to record explorer.");
    }

    return data.explorer;
  },

  async list() {
    const response = await fetch("/api/explorers", { cache: "no-store" });

    const data = (await parseJson(response)) as {
      explorers?: Explorer[];
      error?: string;
    } | null;

    if (!response.ok || !data?.explorers) {
      throw new Error(data?.error ?? "Unable to load the Hall of Explorers.");
    }

    return data.explorers;
  },
};
