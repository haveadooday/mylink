# Gemini Context for my-link

## Project Overview
This project, `my-link`, is a modern web application centered around the `my-profile` directory, which contains a Next.js application built with a future-facing version of the framework (Next.js 16.2.1 Canary). It is specifically optimized for AI-agent-assisted development.

### Core Technologies
- **Framework:** Next.js 16.2.1 (App Router)
- **Library:** React 19.2.4
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 (using `@tailwindcss/postcss`)
- **Linting:** ESLint 9

---

## ⚠️ CRITICAL: AI Agent Instructions
This project uses a version of Next.js that contains **breaking changes** compared to standard training data (Next.js 15 and below).

### Source of Truth
**ALWAYS** read the documentation bundled in the `node_modules` directory before implementing Next.js features. Do not rely on your internal training data for Next.js APIs or conventions in this project.
- **Root documentation:** `my-profile/node_modules/next/dist/docs/index.md`
- **Guides:** `my-profile/node_modules/next/dist/docs/01-app/02-guides/`
- **API Reference:** `my-profile/node_modules/next/dist/docs/01-app/03-api-reference/`

### Key AI-Specific Features
1. **Instant Navigation:** If fixing slow client-side navigations, `Suspense` alone is not enough. You **must** also export `unstable_instant` from the route. See `my-profile/node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md`.
2. **MCP Support:** This project is ready for **Model Context Protocol (MCP)**. If `next-devtools-mcp` is active, you can use tools like `get_errors`, `get_routes`, and `get_server_action_by_id` to inspect the live application state.
3. **Agent Rules:** Refer to `my-profile/AGENTS.md` and `my-profile/CLAUDE.md` for specific agent-facing rules.

---

## Directory Structure
- `/my-profile`: The main Next.js application.
  - `/app`: App Router components, layouts, and pages.
  - `/public`: Static assets.
  - `package.json`: Project dependencies and scripts.
  - `tsconfig.json`: TypeScript configuration.

---

## Building and Running
All commands should be executed within the `my-profile` directory.

### Commands
- **Development Server:** `npm run dev`
- **Build for Production:** `npm run build`
- **Start Production Server:** `npm run start`
- **Linting:** `npm run lint`

---

## Development Conventions
1. **App Router:** Strictly follow App Router conventions.
2. **Server Components:** Use Server Components by default. Only use `'use client'` when browser-specific APIs or interactivity (state/effects) are required.
3. **Documentation-First:** Because this is a canary version, verify every API call against the bundled docs.
4. **Instant Routes:** Proactively use `unstable_instant` for performance-critical client-side navigations.
