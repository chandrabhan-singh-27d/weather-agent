# 🌤️ Weather Agent

An AI-powered weather assistant that uses **Claude (Haiku 4.5)** with tool-calling to fetch real-time weather data. Ask natural language questions — the agent decides which tools to call, fetches data from OpenWeather, and responds conversationally.

![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat&logo=typescript&logoColor=fff)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat&logo=react&logoColor=000)
![Claude](https://img.shields.io/badge/Claude-Haiku_4.5-cc785c?style=flat)

---

## ✨ Features

- **AI Agent Loop** — Claude decides when and which tools to call (no hardcoded logic)
- **Tool Calling** — `get_current_weather` and `get_forecast` backed by OpenWeather API
- **Chat UI** — Clean React interface with message bubbles, typing indicator, and suggestion chips
- **Expandable Tool Calls** — Click to inspect raw tool call data in the UI
- **Multi-city Support** — Ask about multiple cities in one question

## 🏗️ Architecture

```
User Question
     ↓
React Chat UI → POST /api/ask
     ↓
Express Server → Claude API (with tool definitions)
     ↓
Claude decides → tool_use: get_current_weather({ city: "Paris" })
     ↓
Server executes → OpenWeather API
     ↓
Tool result → fed back to Claude
     ↓
Claude responds → conversational answer → UI
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- [OpenWeather API key](https://openweathermap.org/api) (free tier)
- [Anthropic API key](https://console.anthropic.com/)

### Setup

```bash
# Clone
git clone https://github.com/chandrabhan-singh-27d/weather-agent.git
cd weather-agent

# Install dependencies
cd server && npm install
cd ../client && npm install

# Configure environment
cp server/.env.sample server/.env
# Edit server/.env and add your API keys
```

### Run

```bash
# Terminal 1 — Server (port 3000)
cd server && npm run dev

# Terminal 2 — Client (port 5173)
cd client && npm run dev
```

Open **http://localhost:5173**

## 💬 Example Queries

- "What's the weather in New Delhi?"
- "Compare weather in London and Tokyo"
- "5-day forecast for Paris in Fahrenheit"
- "Is it raining in Mumbai right now?"

## 🧰 Tech Stack

| Layer | Tech |
|-------|------|
| **LLM** | Claude Haiku 4.5 via `@anthropic-ai/sdk` |
| **Backend** | Express 5, TypeScript, tsx |
| **Frontend** | React 19, Vite 7, Tailwind CSS 4 |
| **Weather Data** | OpenWeather API (free tier) |
| **Quality** | ESLint, Prettier, TypeScript strict mode |

## 📁 Project Structure

```
server/src/
├── tools/definitions.ts    # Tool schemas for Claude
├── tools/handlers.ts       # Tool execution (OpenWeather calls)
├── controllers/agent.controller.ts  # Agentic loop orchestration
├── routes/                 # Express routes
├── config/env.ts           # Environment config
└── index.ts                # App entry

client/src/
├── App.tsx                 # Chat UI
├── main.tsx                # React entry
└── index.css               # Tailwind imports
```

## 🔧 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (both dirs) |
| `npm run build` | TypeScript compile / Vite build |
| `npm run lint` | ESLint check |
| `npm run check` | tsc + eslint + prettier |
| `npm run format` | Prettier auto-fix |
