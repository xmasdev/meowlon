export const HOME_README = `# ~

hi, i'm melon ^^
this whole site is a tiny linux box. poke around with
\`ls\`, \`cd\` and \`cat\`.

  about/       who i am
  projects/    stuff i made
  experience/  where i've worked
  skills/      what i work with
  contact/     say hi
`;

export const ABOUT_README = `# about

hi, i'm melon :3

  student · furry · pokémon enjoyer
  (eevee + its evolutions, pikachu,
  gen 1 in general)

i like making stuff from scratch. it's
fun, and it teaches you a lot along the
way.

mostly backend, networking, databases
and linux stuff.

lost? type \`help\`, or tap the shortcuts
below.
`;

export const PROJECTS_README = `# projects

things i made, mostly from scratch, cuz that's the
part i enjoy.

- cantaloupe       bittorrent client in go
- webp2p           tcp-ish reliable transport over udp
- melonlang        my own programming language
- quickcommerce    blinkit vs zepto price comparison
- melonpost        full-stack video sharing platform
- random things    a neural net and a chess engine

each one has a README. for example:
  cat ~/projects/cantaloupe/README.md
`;

export const PROJECTS: Record<string, string> = {
  cantaloupe: `# cantaloupe
https://github.com/xmasdev/cantaloupe

a bittorrent client, written in go.

built it to figure out how peer-to-peer file sharing
actually works, protocol and all, from the ground up.

tech: go, bittorrent, wails
`,

  webp2p: `# webp2p
https://github.com/xmasdev/webp2p

a reliable, tcp-like transport built on top of udp,
so two peers can talk to each other directly.

what's inside:
- acks and retransmissions
- packet framing and ordered delivery
- sliding-window flow control
- udp hole punching to get through NAT
- concurrent message handling

tech: go, udp sockets, nat traversal
`,

  melonlang: `# melonlang
https://github.com/xmasdev/melonlang

a programming language. yes, it's named after me.
the interpreter is written in go.

it does arithmetic and logic expressions, variables,
labels, conditionals, and goto (yes, goto).

under the hood: lexer, parser, AST, and an evaluator,
plus a REPL and support for running .mel files.

tech: go, interpreter design
`,

  "random things": `# random things

small stuff that didn't need its own folder.

## neural network
forward propagation, backpropagation and gradient
descent, implemented from scratch.

## chess engine
legal move generation, minimax search, and
alpha-beta pruning.

tech: python, tensorflow
`,

  quickcommerce: `# quickcommerce
https://github.com/xmasdev/quickcommerce-scraper

compares prices across quick-commerce apps
(blinkit and zepto).

how it gets the data: a headless playwright browser
intercepts the apps' api calls, driven by async
automation. a python rest api serves the prices to a
react frontend, which handles the client-side js and
session cookies.

tech: python, playwright, javascript, react
`,

  melonpost: `# melonpost
https://github.com/xmasdev/melonpost-frontend
https://github.com/xmasdev/melonpost-backend

a full-stack video sharing platform.

jwt auth, a react / next.js frontend, and a rest api
backend on node.js, express and mongodb.

tech: react, next.js, node.js, express, mongodb
`,
};

export const EXPERIENCE_README = `# experience

intuit · swe intern · bangalore

  campaigns   python tools + automation
              to evaluate outbound
              campaigns and dig
              insights out of the data

  ai tools    MCP-based tools and agent
              integrations, wiring MCPs
              into internal data, APIs
              and knowledge bases
`;

export const SKILLS_README = `# skills

  languages   python, go, javascript,
              c++, sql

  backend     node.js, express,
              rest apis,
              async programming

  frontend    react, next.js, html, css

  databases   mongodb, postgresql

  tools       linux / unix, git, github,
              databricks, playwright

  ai / ml     MCP, ai agents & tooling,
              tensorflow,
              neural networks

  concepts    concurrency,
              computer networks,
              operating systems, dbms,
              data structures &
              algorithms
`;

export const CONTACT_README = `# contact

say hi ^^ i'm friendly, promise.

email     melonberryie@gmail.com
discord   melon.pika
github    https://github.com/xmasdev

code stuff or pokémon stuff, either works :3
`;
