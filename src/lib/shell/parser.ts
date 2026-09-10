import type { ParsedCommand } from "./types";

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let quote: '"' | "'" | null = null;
  let started = false;

  for (const char of input) {
    if (quote) {
      if (char === quote) {
        quote = null;
      } else {
        current += char;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      started = true;
      continue;
    }

    if (/\s/.test(char)) {
      if (started) {
        tokens.push(current);
        current = "";
        started = false;
      }
      continue;
    }

    current += char;
    started = true;
  }

  if (started) tokens.push(current);

  return tokens;
}

export function parseCommand(input: string): ParsedCommand | null {
  const tokens = tokenize(input);
  if (tokens.length === 0) return null;

  const [name, ...rest] = tokens;
  const args: string[] = [];
  const flags = new Set<string>();

  for (const token of rest) {
    if (token.startsWith("--") && token.length > 2) {
      flags.add(token.slice(2));
      continue;
    }

    if (token.startsWith("-") && token.length > 1 && !/^-\d/.test(token)) {
      for (const character of token.slice(1)) flags.add(character);
      continue;
    }

    args.push(token);
  }

  return { raw: input, name, args, flags };
}
