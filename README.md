# meowlon

My personal portfolio, built as an interactive Linux terminal.

The site is a normal portfolio (about, projects, experience, skills, contact) that you navigate by
typing real-feeling shell commands. Hidden underneath it is a small exploration puzzle built out of
Linux concepts. The terminal is a **simulation** — it never executes real commands, touches the host
filesystem, or reads the real `/proc`.

## Features

- Aesthetic landing page with profile image, diagonal divider, and a live terminal.
- A virtual Linux environment: filesystem, shell state, command registry, process table, and a
  dynamically generated `/proc`.
- Tab completion and up/down command history.
- A live clock.
- A hidden, progressive puzzle that ends in an interactive "unicorn" program and a shared
  Hall of Explorers (persisted in a database).
- Everything interactive runs client-side; the server is only used for the explorers API.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS v4
- Upstash Redis (free tier) for the Hall of Explorers

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your database credentials (see below)
npm run dev
```

Open http://localhost:3000.

### Environment variables

The Hall of Explorers is stored in Redis. Create a free database at
[console.upstash.com](https://console.upstash.com), copy the REST URL and token, and set them in
`.env.local`:

```bash
UPSTASH_REDIS_REST_URL="https://xxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxxx"
```

If you deploy through the Vercel + Upstash integration, it injects `KV_REST_API_URL` and
`KV_REST_API_TOKEN` instead — both names are supported.

If no credentials are set, the API falls back to an in-memory store (fine for local development,
but submissions are not shared or persistent, and it logs a warning in production).

## Terminal commands

`pwd` `cd` `ls` `cat` `file` `strings` `cp` `whoami` `history` `env` `export` `ps` `readlink`
`echo` `clear` `help`

Unknown commands return `command not found`. `help` lists everything. Path-like input (e.g.
`/tmp/unicorn`) is executed if it resolves to an executable in the virtual filesystem.

## Project structure

```
src/
├── app/
│   ├── api/explorers/route.ts   # GET + POST for the Hall of Explorers
│   ├── layout.tsx               # fonts + metadata
│   ├── page.tsx                 # landing page
│   └── globals.css
├── components/
│   ├── terminal.tsx             # terminal UI, history, completion, interactive input
│   ├── clock.tsx
│   └── diagonal-divider.tsx
└── lib/
    ├── explorers/               # client, store, validation, rate limiting
    └── shell/                   # the virtual Linux environment
        ├── types.ts             # shared types
        ├── filesystem.ts        # virtual filesystem (resolve/open/read/write)
        ├── path.ts, format.ts, errors.ts
        ├── parser.ts            # tokenizes input into name/args/flags
        ├── shell.ts             # state + command/program dispatch + interactive I/O
        ├── processes.ts, proc.ts# process table + virtual /proc
        ├── events.ts            # puzzle event bus
        ├── completion.ts        # tab completion
        ├── startup.ts           # startup info block
        ├── commands/            # one file per command
        ├── programs/            # executable programs (e.g. unicorn)
        └── content/             # <-- editable content lives here
            ├── portfolio.ts     # portfolio text (about, projects, skills, ...)
            ├── fs-data.ts       # builds the virtual filesystem tree
            ├── process-data.ts  # virtual processes
            └── puzzle.ts        # puzzle content, event names, banner
```

## Editing content

- **Portfolio text** lives in `src/lib/shell/content/portfolio.ts`. Each section's `README.md`
  content is a named constant; projects are a map, so adding a key auto-creates a directory.
- **Filesystem layout** is built in `src/lib/shell/content/fs-data.ts`.
- **Puzzle content** (clues, event names, unicorn banner) lives in
  `src/lib/shell/content/puzzle.ts`; the suspicious process is defined in `process-data.ts`.

## The puzzle

<details>
<summary>Spoilers — click to reveal the full path</summary>

1. `cd /` and notice `secrets.txt`; `cat secrets.txt` says unicorns do exist but this is not it.
2. `ls -a` reveals `.secrets`: "files aren't the only things that can be hidden."
3. `ps aux` shows a process running `/opt/unicorn`, but `ls /opt` is empty.
4. `readlink /proc/666/exe` shows `/opt/unicorn (deleted)`.
5. `cp /proc/666/exe /tmp/unicorn` recovers the executable.
6. `/tmp/unicorn` runs an interactive program that asks for a username and a note, then shows the
   Hall of Explorers.

Events are emitted along the way (`ROOT_SECRET_DISCOVERED`, `UNICORN_PROCESS_DISCOVERED`,
`UNICORN_RECOVERED`, etc.) via `src/lib/shell/events.ts`.

</details>

## API

- `POST /api/explorers` — body `{ username, note }`. Validated server-side (required, username
  ≤ 32 chars, note ≤ 200 chars, control characters stripped). Returns the created record.
- `GET /api/explorers` — returns `{ explorers: [...] }` in submission order.

Records store a server-generated timestamp. Submissions are rate-limited by IP.

## Scripts

```bash
npm run dev     # start the dev server
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
```

## Development notes

- Testing on a phone via a `cloudflared` quick tunnel requires allowing the tunnel origin in
  `next.config.ts` (`allowedDevOrigins`), otherwise Next blocks the HMR websocket. This only affects
  `next dev`.
- The profile image is `public/image.png`. Credit: [@terenry](https://x.com/Terenry_).
- The startup block fetches the visitor's IP from `api.ipify.org` on a best-effort basis and omits
  the line if it fails.
