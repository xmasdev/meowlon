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
  | { kind: "command"; command: string; output: string[] }
  | { kind: "input"; prompt: string; value: string }
  | { kind: "output"; output: string[] };

type CompletionState = {
  candidates: CompletionCandidate[];
  index: number;
  prefix: string;
};

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

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef("");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [entries, completion, awaiting]);

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

  const submit = () => {
    const value = input;
    setInput("");
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
      { kind: "command", command: value, output: [] },
    ]);

    void session.shell
      .run(value, {
        onOutput: appendOutput,
        onPrompt: (prompt) => setAwaiting(prompt),
      })
      .then((result) => {
        if (result.clear) setEntries([]);
      })
      .catch(() => {});
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
        setInput(history[index]);
      } else if (historyCursor > 0) {
        const index = historyCursor - 1;
        setHistoryCursor(index);
        setInput(history[index]);
      }
      return;
    }

    if (historyCursor === null) return;

    if (historyCursor < history.length - 1) {
      const index = historyCursor + 1;
      setHistoryCursor(index);
      setInput(history[index]);
    } else {
      setHistoryCursor(null);
      setInput(draftRef.current);
    }
  };

  const cycleCompletion = () => {
    if (completion && completion.candidates.length > 0) {
      const index = (completion.index + 1) % completion.candidates.length;
      setCompletion({ ...completion, index });
      setInput(completion.prefix + completion.candidates[index].value);
      return;
    }

    const result = completeInput(session.shell, input);
    if (result.candidates.length === 0) return;

    const prefix = input.slice(0, result.tokenStart);

    if (result.candidates.length === 1) {
      const candidate = result.candidates[0];
      setInput(prefix + candidate.value + (candidate.isDirectory ? "" : " "));
      setCompletion(null);
      return;
    }

    setCompletion({ candidates: result.candidates, index: 0, prefix });
    setInput(prefix + result.candidates[0].value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (awaiting !== null) return;

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

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f16]/85 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_30px_80px_-20px_rgba(34,211,238,0.25)] backdrop-blur-xl"
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

      <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.02] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-zinc-500">
          melon@arch: ~
        </span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
          bash
        </span>
      </div>

      <div
        ref={scrollRef}
        className="terminal-scroll min-h-[220px] max-h-[420px] space-y-2 overflow-y-auto px-5 py-6 font-mono text-sm sm:px-7 sm:py-8 sm:text-base"
      >
        <span className="sr-only">
          Interactive terminal. Type a command and press enter.
        </span>

        {entries.map((entry, index) => {
          if (entry.kind === "input") {
            return (
              <div
                key={index}
                className="flex flex-wrap items-center gap-x-2"
              >
                <ProgramPrompt prompt={entry.prompt} />
                <span className="text-zinc-100">{entry.value}</span>
              </div>
            );
          }

          return (
            <div key={index} className="space-y-2">
              {entry.kind === "command" && (
                <div className="flex flex-wrap items-center gap-x-2">
                  <Prompt />
                  <span className="text-zinc-100">{entry.command}</span>
                </div>
              )}
              {entry.output.map((line, lineIndex) => (
                <div
                  key={lineIndex}
                  className="whitespace-pre-wrap text-zinc-400"
                >
                  {line}
                </div>
              ))}
            </div>
          );
        })}

        {completion && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-zinc-500">
            {completion.candidates.map((candidate, index) => (
              <span
                key={`${candidate.value}-${index}`}
                className={
                  index === completion.index ? "text-cyan-300" : undefined
                }
              >
                {candidate.value}
              </span>
            ))}
          </div>
        )}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          className="flex items-center gap-x-2"
        >
          {awaiting !== null ? (
            <ProgramPrompt prompt={awaiting} />
          ) : (
            <Prompt />
          )}
          <div className="relative min-w-0 flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setHistoryCursor(null);
                setCompletion(null);
              }}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Terminal input"
              className="absolute inset-0 w-full bg-transparent text-transparent caret-transparent outline-none"
            />
            <span className="pointer-events-none whitespace-pre-wrap break-all text-zinc-100">
              {input}
            </span>
            <Cursor />
          </div>
        </form>
      </div>
    </div>
  );
}

function Prompt() {
  return (
    <span className="shrink-0">
      <span className="text-emerald-400">root@arch</span>
      <span className="text-zinc-600">:</span>
      <span className="text-cyan-400">~</span>
      <span className="text-zinc-600">#</span>
    </span>
  );
}

function ProgramPrompt({ prompt }: { prompt: string }) {
  return (
    <span className="shrink-0">
      <span className="text-cyan-300">{prompt}</span>
      <span className="text-zinc-600">&gt;</span>
    </span>
  );
}

function Cursor() {
  return (
    <span className="ml-0.5 inline-block h-4 w-[0.55em] translate-y-[2px] animate-blink bg-cyan-300/90 sm:h-5" />
  );
}
