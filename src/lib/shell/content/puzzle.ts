export const PuzzleEvent = {
  RootSecretDiscovered: "ROOT_SECRET_DISCOVERED",
  HiddenSecretDiscovered: "HIDDEN_SECRET_DISCOVERED",
  UnicornProcessDiscovered: "UNICORN_PROCESS_DISCOVERED",
  DeletedExecutableDiscovered: "DELETED_EXECUTABLE_DISCOVERED",
  UnicornRecovered: "UNICORN_RECOVERED",
  UnicornExecuted: "UNICORN_EXECUTED",
  ExplorerSubmitted: "EXPLORER_SUBMITTED",
  UnicornCompleted: "UNICORN_COMPLETED",
} as const;

export const SECRETS_TXT = `unicorns do exist

but this is not it.

keep looking.
`;

export const DOT_SECRETS = `files aren't the only things that can be hidden.
`;

export const UNICORN_BINARY = [
  "\u007fELF\u0002\u0001\u0001",
  "/opt/unicorn",
  "unicorn",
  "ELF64",
  "HALL_OF_EXPLORERS",
].join("\n");

export const UNICORN_BANNER = [
  "",
  "  /\\_/\\",
  " ( o.o )",
  "  > ^ <",
  "",
  "You found me.",
  "",
  "Congratulations, explorer.",
  "",
  "You found the secret.",
  "",
];

export const UNICORN_USERNAME_QUESTION = "What's your username?";
export const UNICORN_USERNAME_PROMPT = "username";
export const UNICORN_NOTE_QUESTION = "Leave a note for the next explorer:";
export const UNICORN_NOTE_PROMPT = "note";
export const UNICORN_RECORDING = "Recording explorer...";
export const UNICORN_WELCOME = "✓ Welcome to the Unicorn Club.";

export const UNICORN_USERNAME_MAX = 32;
export const UNICORN_NOTE_MAX = 200;
