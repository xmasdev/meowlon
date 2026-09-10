import type { Explorer, Program, ProgramContext } from "../types";
import {
  PuzzleEvent,
  UNICORN_BANNER,
  UNICORN_NOTE_MAX,
  UNICORN_NOTE_PROMPT,
  UNICORN_NOTE_QUESTION,
  UNICORN_RECORDING,
  UNICORN_USERNAME_MAX,
  UNICORN_USERNAME_PROMPT,
  UNICORN_USERNAME_QUESTION,
  UNICORN_WELCOME,
} from "../content/puzzle";

async function ask(
  context: ProgramContext,
  question: string,
  prompt: string,
  max: number,
): Promise<string> {
  const { print, read } = context;

  for (;;) {
    print([question]);
    const value = (await read(prompt)).trim();

    if (value.length === 0) {
      print(["Please enter something."]);
      continue;
    }
    if (value.length > max) {
      print([`Please keep it to ${max} characters or fewer.`]);
      continue;
    }

    return value;
  }
}

function formatHall(explorers: Explorer[]): string[] {
  const lines = [
    "",
    "─────────────────────────────────────",
    "         HALL OF EXPLORERS",
    "─────────────────────────────────────",
    "",
  ];

  if (explorers.length === 0) {
    lines.push("No explorers yet. You are the first.");
  } else {
    lines.push(`${"#".padEnd(4)}${"Explorer".padEnd(17)}Note`, "");
    explorers.forEach((explorer, index) => {
      lines.push(
        `${String(index + 1).padEnd(4)}${explorer.username.padEnd(17)}${explorer.note}`,
      );
    });
  }

  lines.push("");
  const count = explorers.length;
  lines.push(
    `${count} explorer${count === 1 ? "" : "s"} ${count === 1 ? "has" : "have"} found the unicorn.`,
  );

  return lines;
}

export const unicornProgram: Program = {
  name: "unicorn",
  async run(context) {
    const { print, emit, explorerApi } = context;

    emit(PuzzleEvent.UnicornExecuted);
    print(UNICORN_BANNER);

    const username = await ask(
      context,
      UNICORN_USERNAME_QUESTION,
      UNICORN_USERNAME_PROMPT,
      UNICORN_USERNAME_MAX,
    );
    const note = await ask(
      context,
      UNICORN_NOTE_QUESTION,
      UNICORN_NOTE_PROMPT,
      UNICORN_NOTE_MAX,
    );

    print(["", UNICORN_RECORDING, ""]);

    if (!explorerApi) {
      print(["The Unicorn Club is unavailable right now.", ""]);
      return;
    }

    try {
      await explorerApi.submit({ username, note });
      emit(PuzzleEvent.ExplorerSubmitted);
    } catch (error) {
      print([
        error instanceof Error ? error.message : "Failed to record explorer.",
        "",
      ]);
      return;
    }

    try {
      const explorers = await explorerApi.list();
      print(formatHall(explorers));
      print(["", UNICORN_WELCOME, ""]);
      emit(PuzzleEvent.UnicornCompleted);
    } catch {
      print([
        "You are in the Unicorn Club, but the Hall of Explorers could not be loaded.",
        "",
      ]);
    }
  },
};
