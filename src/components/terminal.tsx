"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Shell } from "@/lib/shell/shell";
import { createStartupInfo, infoRow } from "@/lib/shell/startup";
import {
  completeInput,
  type CompletionCandidate,
} from "@/lib/shell/completion";
import { explorerApi } from "@/lib/explorers/client";

type Entry =
  | { kind: "startup"; output: string[] }
  | { kind: "command"; command: string; cwd: string; output: string[] }
  | { kind: "input"; prompt: string; value: string }
  | { kind: "output"; output: string[] };

type CompletionState = {
  candidates: CompletionCandidate[];
  index: number;
  prefix: string;
};

type Shortcut = { id: string; label: string; command: string };

const SHORTCUTS: Shortcut[] = [
  { id: "about", label: "about", command: "cat ~/about/README.md" },
  { id: "projects", label: "projects", command: "cat ~/projects/README.md" },
  {
    id: "experience",
    label: "experience",
    command: "cat ~/experience/README.md",
  },
  { id: "skills", label: "skills", command: "cat ~/skills/README.md" },
  { id: "contact", label: "contact", command: "cat ~/contact/README.md" },
];

const HELP_SHORTCUT: Shortcut = { id: "help", label: "help", command: "help" };

const TYPE_DELAY_MS = 22;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hasFinePointer(): boolean {
  return window.matchMedia("(pointer: fine)").matches;
}

export function Terminal() {
  const [session] = useState(() => {
    const shell = new Shell({ explorerApi });
    return { shell, startup: createStartupInfo(shell) };
  });

  const [entries, setEntries] = useState<Entry[]>(() => [
    { kind: "startup", output: session.startup },
  ]);
  const [input, setInput] = useState("");
  const [awaiting, setAwaiting] = useState<string | null>(null);
  const [historyCursor, setHistoryCursor] = useState<number | null>(null);
  const [completion, setCompletion] = useState<CompletionState | null>(null);
  const [caret, setCaret] = useState(0);
  const [cwd, setCwd] = useState(session.shell.state.cwd);
  const [typing, setTyping] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef("");
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hasFinePointer()) inputRef.current?.focus();
    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, []);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [entries, completion, awaiting, input]);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const finish = (ip: string | null) => {
      setEntries((previous) =>
        previous.map((entry) =>
          entry.kind === "startup"
            ? {
                ...entry,
                output: [...entry.output, ...(ip ? [infoRow("IP", ip)] : [])],
              }
            : entry,
        ),
      );
    };

    fetch("https://api.ipify.org?format=json", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { ip?: string } | null) => finish(data?.ip ?? null))
      .catch(() => finish(null))
      .finally(() => clearTimeout(timeout));

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);

  const appendOutput = (lines: string[]) => {
    if (lines.length === 0) return;
    setEntries((previous) => {
      const last = previous[previous.length - 1];
      if (last && (last.kind === "command" || last.kind === "output")) {
        return [
          ...previous.slice(0, -1),
          { ...last, output: [...last.output, ...lines] },
        ];
      }
      return [...previous, { kind: "output", output: lines }];
    });
  };

  const updateInput = (value: string) => {
    setInput(value);
    setCaret(value.length);
  };

  const syncCaret = () => {
    const node = inputRef.current;
    if (node) setCaret(node.selectionStart ?? 0);
  };

  const submit = (value: string) => {
    updateInput("");
    setHistoryCursor(null);
    setCompletion(null);

    if (awaiting !== null) {
      setEntries((previous) => [
        ...previous,
        { kind: "input", prompt: awaiting, value },
      ]);
      setAwaiting(null);
      session.shell.provideInput(value);
      return;
    }

    setEntries((previous) => [
      ...previous,
      { kind: "command", command: value, cwd: session.shell.state.cwd, output: [] },
    ]);

    void session.shell
      .run(value, {
        onOutput: appendOutput,
        onPrompt: (prompt) => setAwaiting(prompt),
      })
      .then((result) => {
        if (result.clear) setEntries([]);
      })
      .catch(() => {})
      .finally(() => setCwd(session.shell.state.cwd));
  };

  const runShortcut = (shortcut: Shortcut) => {
    if (typing || awaiting !== null) return;

    setActive(shortcut.id);
    setCompletion(null);
    setHistoryCursor(null);

    const finish = () => {
      setTyping(false);
      submit(shortcut.command);
      if (hasFinePointer()) inputRef.current?.focus();
    };

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    setTyping(true);
    let length = 0;
    const step = () => {
      length += 1;
      updateInput(shortcut.command.slice(0, length));
      if (length < shortcut.command.length) {
        typingTimer.current = setTimeout(step, TYPE_DELAY_MS);
      } else {
        typingTimer.current = setTimeout(finish, TYPE_DELAY_MS * 6);
      }
    };
    updateInput("");
    typingTimer.current = setTimeout(step, TYPE_DELAY_MS);
  };

  const navigateHistory = (direction: -1 | 1) => {
    const history = session.shell.state.history;
    if (history.length === 0) return;

    setCompletion(null);

    if (direction === -1) {
      if (historyCursor === null) {
        draftRef.current = input;
        const index = history.length - 1;
        setHistoryCursor(index);
        updateInput(history[index]);
      } else if (historyCursor > 0) {
        const index = historyCursor - 1;
        setHistoryCursor(index);
        updateInput(history[index]);
      }
      return;
    }

    if (historyCursor === null) return;

    if (historyCursor < history.length - 1) {
      const index = historyCursor + 1;
      setHistoryCursor(index);
      updateInput(history[index]);
    } else {
      setHistoryCursor(null);
      updateInput(draftRef.current);
    }
  };

  const cycleCompletion = () => {
    if (completion && completion.candidates.length > 0) {
      const index = (completion.index + 1) % completion.candidates.length;
      setCompletion({ ...completion, index });
      updateInput(completion.prefix + completion.candidates[index].value);
      return;
    }

    const result = completeInput(session.shell, input);
    if (result.candidates.length === 0) return;

    const prefix = input.slice(0, result.tokenStart);

    if (result.candidates.length === 1) {
      const candidate = result.candidates[0];
      updateInput(prefix + candidate.value + (candidate.isDirectory ? "" : " "));
      setCompletion(null);
      return;
    }

    setCompletion({ candidates: result.candidates, index: 0, prefix });
    updateInput(prefix + result.candidates[0].value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (awaiting !== null || typing) return;

    if (event.key === "ArrowUp") {
      event.preventDefault();
      navigateHistory(-1);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      navigateHistory(1);
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      cycleCompletion();
    }
  };

  const caretIndex = Math.min(caret, input.length);
  const home = session.shell.state.home;
  const shortcutsDisabled = typing || awaiting !== null;

  return (
    <div className="relative w-full min-w-0 overflow-hidden rounded-xl border border-peach/10 bg-dusk-850/90 shadow-[0_40px_80px_-30px_rgba(7,11,21,0.9),0_18px_50px_-24px_rgba(200,78,65,0.35)] backdrop-blur-md">
      <div className="flex items-center gap-3 border-b border-peach/[0.07] bg-dusk-900/60 px-4 py-2.5 font-mono text-xs">
        <span className="text-ink-dim">
          melon@arch: <span className="text-ink-muted">{displayPath(cwd, home)}</span>
        </span>
        <span className="ml-auto text-ink-dim">bash</span>
      </div>

      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="terminal-scroll h-[clamp(280px,52vh,460px)] cursor-text space-y-2 overflow-y-auto px-4 py-5 font-mono text-[13px] leading-relaxed sm:px-6 sm:py-6 sm:text-[15px]"
      >
        <span className="sr-only">
          Interactive terminal. Type a command and press enter, or use the
          shortcuts below the terminal.
        </span>

        {entries.map((entry, index) => {
          if (entry.kind === "input") {
            return (
              <div key={index} className="flex flex-wrap items-center gap-x-2">
                <ProgramPrompt prompt={entry.prompt} />
                <span className="text-ink">{entry.value}</span>
              </div>
            );
          }

          return (
            <div key={index} className="space-y-1.5">
              {entry.kind === "command" && (
                <div className="flex flex-wrap items-center gap-x-2">
                  <Prompt cwd={displayPath(entry.cwd, home)} />
                  <span className="break-all text-ink">{entry.command}</span>
                </div>
              )}
              {entry.output.map((line, lineIndex) => (
                <div
                  key={lineIndex}
                  className={
                    entry.kind === "startup" && lineIndex === 0
                      ? "whitespace-pre-wrap text-peach"
                      : "whitespace-pre-wrap break-words text-ink-muted"
                  }
                >
                  {line}
                </div>
              ))}
            </div>
          );
        })}

        {completion && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-ink-dim">
            {completion.candidates.map((candidate, index) => (
              <span
                key={`${candidate.value}-${index}`}
                className={index === completion.index ? "text-ember" : undefined}
              >
                {candidate.value}
              </span>
            ))}
          </div>
        )}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!typing) submit(input);
          }}
          className="flex items-start gap-x-2"
        >
          {awaiting !== null ? (
            <ProgramPrompt prompt={awaiting} />
          ) : (
            <Prompt cwd={displayPath(cwd, home)} />
          )}
          <div className="relative min-w-0 flex-1">
            <input
              ref={inputRef}
              value={input}
              readOnly={typing}
              onChange={(event) => {
                const value = event.target.value;
                setInput(value);
                setCaret(event.target.selectionStart ?? value.length);
                setHistoryCursor(null);
                setCompletion(null);
              }}
              onKeyDown={handleKeyDown}
              onKeyUp={(event) => {
                if (
                  event.key === "ArrowLeft" ||
                  event.key === "ArrowRight" ||
                  event.key === "Home" ||
                  event.key === "End"
                ) {
                  syncCaret();
                }
              }}
              onClick={syncCaret}
              onSelect={syncCaret}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="go"
              aria-label="Terminal input"
              className="absolute inset-0 w-full bg-transparent text-transparent caret-transparent outline-none"
            />
            <span className="pointer-events-none whitespace-pre-wrap break-all text-ink">
              {input.slice(0, caretIndex)}
              <span className={typing ? "bg-ember text-dusk-900" : "animate-cursor"}>
                {input[caretIndex] ?? " "}
              </span>
              {input.slice(caretIndex + 1)}
            </span>
          </div>
        </form>
      </div>

      <nav
        aria-label="Portfolio sections"
        className="flex items-stretch border-t border-peach/[0.07] bg-dusk-900/80 font-mono text-[13px]"
      >
        <span className="hidden shrink-0 items-center bg-ember px-3 font-semibold text-dusk-900 sm:flex">
          melon
        </span>
        <ul className="no-scrollbar flex min-w-0 flex-1 items-stretch overflow-x-auto max-sm:[mask-image:linear-gradient(90deg,#000_calc(100%-40px),transparent)]">
          {SHORTCUTS.map((shortcut) => (
            <li key={shortcut.id} className="flex">
              <ShortcutButton
                shortcut={shortcut}
                active={active === shortcut.id}
                disabled={shortcutsDisabled}
                onRun={runShortcut}
              />
            </li>
          ))}
          <li className="ml-auto flex">
            <ShortcutButton
              shortcut={HELP_SHORTCUT}
              active={active === HELP_SHORTCUT.id}
              disabled={shortcutsDisabled}
              onRun={runShortcut}
            />
          </li>
        </ul>
      </nav>
    </div>
  );
}

function ShortcutButton({
  shortcut,
  active,
  disabled,
  onRun,
}: {
  shortcut: Shortcut;
  active: boolean;
  disabled: boolean;
  onRun: (shortcut: Shortcut) => void;
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.currentTarget.scrollIntoView({
          block: "nearest",
          inline: "nearest",
          behavior: "smooth",
        });
        onRun(shortcut);
      }}
      aria-disabled={disabled}
      title={`Runs: ${shortcut.command}`}
      aria-current={active ? "true" : undefined}
      className={[
        "relative flex h-11 shrink-0 items-center px-3 transition-colors duration-200 sm:h-9",
        "focus-visible:-outline-offset-2",
        active
          ? "text-peach after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-ember"
          : "text-ink-muted hover:bg-peach/[0.06] hover:text-peach",
        disabled ? "cursor-wait" : "cursor-pointer",
      ].join(" ")}
    >
      {shortcut.label}
    </button>
  );
}

function displayPath(cwd: string, home: string): string {
  if (cwd === home) return "~";
  if (cwd.startsWith(`${home}/`)) return `~${cwd.slice(home.length)}`;
  return cwd;
}

function Prompt({ cwd }: { cwd: string }) {
  return (
    <span className="shrink-0">
      <span className="text-ember">root@arch</span>
      <span className="text-ink-dim">:</span>
      <span className="text-mauve">{cwd}</span>
      <span className="text-ink-dim">#</span>
    </span>
  );
}

function ProgramPrompt({ prompt }: { prompt: string }) {
  return (
    <span className="shrink-0">
      <span className="text-peach">{prompt}</span>
      <span className="text-ink-dim">&gt;</span>
    </span>
  );
}
