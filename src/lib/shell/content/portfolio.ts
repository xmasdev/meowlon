export const HOME_README = `# melon

This portfolio is a virtual Linux environment.
Explore with \`ls\`, \`cd\`, and \`cat\`.

  about/       who I am
  projects/    things I have built
  experience/  where I have worked
  skills/      what I work with
  contact/     how to reach me
`;

export const ABOUT_README = `# About

# Melon

Hi,

I'm a student who likes building things and understanding
what happens underneath them.

I spend most of my time working with backend systems, networking, databases,
Linux, and lower-level software. I especially enjoy projects where I have to
understand the system rather than just use an abstraction.

This terminal is my portfolio.

Use \`help\` to see what you can explore.
`;

export const PROJECTS_README = `# Projects

Projects I've made, mostly these are going to be things made from scratch, cuz I really like understanding how things work 

- cantaloupe - BitTorrent client in Go
- webp2p - TCP-like reliable transport over UDP for peer to peer communication
- melonlang - custom programming language interpreter in Go
- quickcommerce-scraper = A quickcommerce price comparison platform
- melonpost - full-stack video sharing platform

Open a project directory to learn more.
`;

export const PROJECTS: Record<string, string> = {
  cantaloupe: `# cantaloupe
https://github.com/xmasdev/cantaloupe
A BitTorrent client written in Go.

Built to understand peer-to-peer file sharing and the BitTorrent protocol from the ground up.

Tech: Go, BitTorrent, Wails
`,

  webp2p: `# webp2p
https://github.com/xmasdev/webp2p
TCP-like reliable transport over UDP.

Designed a reliable transport protocol with acknowledgements, retransmissions, packet framing, ordered delivery, UDP hole punching across NAT boundaries, sliding-window flow control, and concurrent message handling.

Tech: Go, UDP Sockets, NAT Traversal
`,

  melonlang: `# melonlang
https://github.com/xmasdev/melonlang

A custom programming language interpreter written in Go.

Supports arithmetic and logical expressions, variables, labels, conditional execution, and goto statements.

Implemented lexical analysis, parsing, AST construction, runtime evaluation, a REPL, and execution of .mel files.

Tech: Go, Compiler / Interpreter Design
`,

  "random things": `# random things

## Neural Network
Implemented a neural network from scratch, including forward propagation, backpropagation, and gradient descent.

## Chess Engine
Built a chess engine with legal move generation, minimax search, and alpha-beta pruning.

Tech: Python, TensorFlow
`,

  quickcommerce: `# quickcommerce
https://github.com/xmasdev/quickcommerce-scraper

A price comparison platform for quick-commerce services.

Built a Python data-extraction pipeline for Blinkit and Zepto by intercepting API calls through a headless Playwright browser and asynchronous automation.

Exposed pricing through a Python REST API with a React frontend, including automated client-side JavaScript and session-cookie handling.

Tech: Python, Playwright, JavaScript, React
`,

  melonpost: `# melonpost
https//github.com/xmasdev/melonpost-frontend
https//github.com/xmasdev/melonpost-backend

A full-stack video sharing platform.

Built a JWT-authenticated platform with a React / Next.js frontend and a REST API backend using Node.js, Express, and MongoDB.

Tech: React, Next.js, Node.js, Express, MongoDB
`,
};

export const EXPERIENCE_README = `# Experience

## Intuit - SWE Intern
Bangalore · May 2026 - July 2026

- Built Python tools and automation to evaluate outbound campaigns and pull useful insights from campaign data.
- Built MCP-based AI tools and agent integrations to connect MCPs with internal data, APIs, and knowledge bases.
`;

export const SKILLS_README = `# Skills

## Languages
Python, Go, JavaScript, C++, SQL

## Backend & APIs
Node.js, Express, REST APIs, Asynchronous Programming

## Frontend
React.js, Next.js, HTML, CSS

## Databases & Tools
MongoDB, PostgreSQL, Linux / Unix, Git, GitHub, Databricks, Playwright

## AI & ML
Model Context Protocol (MCP), AI Agents & Tooling, TensorFlow, Neural Networks

## Core Concepts
Concurrent Programming, Computer Networks, Data Structures & Algorithms, Operating Systems, DBMS
`;

export const CONTACT_README = `# Contact

Email
melonberryie@gmail.com

Discord:
melon.pika

GitHub
https://github.com/xmasdev

Feel free to reach out ^^
`;

