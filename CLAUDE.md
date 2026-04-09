# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Weather Agent — an AI-powered weather assistant that uses Claude as the LLM backbone with tool-calling to fetch real-time weather data from OpenWeather API. Users ask natural language weather questions, the agent decides which tools to call, fetches data, and returns conversational answers.

**Stack:** TypeScript monorepo (no workspace manager — just `/server` and `/client` directories)

## Architecture

```
weather-agent/
├── server/          # Express + Claude AI SDK backend
│   └── src/
│       ├── index.ts              # Express app entry
│       ├── config/env.ts         # Env var loading + validation
│       ├── routes/               # Express routes
│       │   ├── index.ts          # Root router, mounts sub-routes
│       │   └── agent.routes.ts   # /health, /ask endpoints
│       ├── controllers/          # Route handlers
│       │   └── agent.controller.ts  # Orchestrates Claude + tools
│       ├── tools/                # Tool definitions for Claude
│       │   ├── definitions.ts    # Tool schemas (JSON Schema format)
│       │   └── handlers.ts       # Tool execution (calls OpenWeather)
│       └── types/agent.d.ts      # Shared request/response types
├── client/          # React + Vite + Tailwind frontend
│   └── src/
│       ├── main.tsx              # React entry
│       ├── App.tsx               # Main chat interface
│       └── index.css             # Tailwind imports
└── CLAUDE.md
```

### Data Flow

1. User types a weather question in the React chat UI
2. Client POSTs to `POST /api/ask` → Vite proxies to `POST /ask` on server
3. Server sends question to Claude API with weather tool definitions
4. Claude decides to call tools (get_current_weather, get_forecast)
5. Server executes tool calls against OpenWeather API
6. Server feeds tool results back to Claude for a final conversational answer
7. JSON response sent back to client

## Commands

### Server (`cd server/`)
```bash
npm run dev          # Start dev server with tsx watch (port 3000)
npm run build        # TypeScript compile to dist/
npm run lint         # ESLint
npm run check        # tsc + eslint + prettier (run before committing)
npm run format       # Prettier write
```

### Client (`cd client/`)
```bash
npm run dev          # Vite dev server (port 5173)
npm run build        # TypeScript check + Vite build
npm run lint         # ESLint
npm run check        # tsc + eslint + prettier (run before committing)
npm run format       # Prettier write
```

### Run both together (from root)
```bash
cd server && npm run dev &
cd client && npm run dev &
```

## Environment Variables

Server `.env` file (at `server/.env`, gitignored):
```
PORT=3000
OPENWEATHER_KEY=<key>       # OpenWeather API key (free tier)
ANTHROPIC_API_KEY=<key>     # Claude API key (required for agent)
```

## Code Conventions

- **TypeScript strict mode** with `noUnusedLocals`, `noUnusedParameters` in both packages
- **Module system:** Server uses NodeNext (ESM with `.js` extensions in imports). Client uses bundler resolution.
- **Formatting:** Prettier — single quotes, semicolons, trailing commas, 100 char width
- **Linting:** ESLint with typescript-eslint in both packages. Client adds react-hooks + react-refresh.
- **Prefer pure functions** — avoid classes, use const arrow functions or function declarations
- **Keep files small** — one concern per file, extract when a file exceeds ~100 lines
- **Never use `any` or `unknown` as types** — always define proper interfaces/types. Use type assertions (`as X`) only when the concrete type is known.
- **No default exports** except for React components and Express routers (framework convention)
- **Naming:** camelCase for variables/functions, PascalCase for types/interfaces, kebab-case for file names
- **Express patterns:** Controllers are async arrow functions with `(req, res)`. Use try/catch inside.

## Key Dependencies

### Server
- `express@5` — HTTP framework
- `@anthropic-ai/sdk` — Claude API client (uses `claude-haiku-4-5` for cost efficiency)
- `cors`, `dotenv` — middleware and config
- `tsx` — dev runner (watch mode)

### Client
- `react@19`, `react-dom@19` — UI (functional components only)
- `tailwindcss@4` with `@tailwindcss/vite` — styling (v4 uses CSS-first config, no tailwind.config.js)
- `vite@7` — bundler

## Important Notes

- Server imports use `.js` extensions (NodeNext resolution): `import { ENV } from './config/env.js'`
- OpenWeather API: free tier, current weather + 5-day forecast. Base URL: `https://api.openweathermap.org/data/2.5/`
- Claude tool-calling: define tools as JSON Schema in `tools/definitions.ts`, execute via `tools/handlers.ts`, loop in controller until `stop_reason === 'end_turn'`
- Client proxies `/api/*` to `http://localhost:3000/*` via Vite config
- Tailwind v4 — no `tailwind.config.js`, configured via `@import "tailwindcss"` in CSS
- Agent uses max 5 tool call rounds to prevent runaway loops

## Git

- **Never add `Co-Authored-By: Claude` or any AI co-author line to commits**
- Commit format: `[TYPE]: message` — e.g. `[FIX]: Bug causing auth token leak`
- Types: FIX, FEAT, REFACTOR, CHORE, DOCS, STYLE, TEST, PERF
