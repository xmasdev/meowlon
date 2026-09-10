export const USERNAME_MAX = 32;
export const NOTE_MAX = 200;

export interface ExplorerInput {
  username: string;
  note: string;
}

export type ValidationResult =
  | { ok: true; value: ExplorerInput }
  | { ok: false; error: string };

function normalize(value: string): string {
  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function validateExplorerInput(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { ok: false, error: "Invalid request body." };
  }

  const { username, note } = body as Record<string, unknown>;

  if (typeof username !== "string") {
    return { ok: false, error: "Username is required." };
  }
  if (typeof note !== "string") {
    return { ok: false, error: "Note is required." };
  }

  const cleanUsername = normalize(username);
  const cleanNote = normalize(note);

  if (cleanUsername.length === 0) {
    return { ok: false, error: "Username is required." };
  }
  if (cleanNote.length === 0) {
    return { ok: false, error: "Note is required." };
  }
  if (cleanUsername.length > USERNAME_MAX) {
    return {
      ok: false,
      error: `Username must be ${USERNAME_MAX} characters or fewer.`,
    };
  }
  if (cleanNote.length > NOTE_MAX) {
    return {
      ok: false,
      error: `Note must be ${NOTE_MAX} characters or fewer.`,
    };
  }

  return { ok: true, value: { username: cleanUsername, note: cleanNote } };
}
