# ترنم مهر — پلتفرم هوشمند کنکور

دستیار تخصصی موفقیت در کنکور سراسری — an AI-powered coaching platform for Iranian university entrance exam (Konkur) students.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/taranom run dev` — run the frontend (port 18881)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts exec tsx ./src/seed.ts` — seed demo data
- Required env: `DATABASE_URL`, `GEMINI_API_KEY`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind v4 + Vazirmatn font (Persian RTL)
- UI: shadcn/ui + Framer Motion + Recharts
- API: Express 5 + cookie-based sessions
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod v4, drizzle-zod
- AI: Google Gemini 2.0 Flash (primary), GapGPT fallback
- API codegen: Orval (from OpenAPI spec in lib/api-spec/)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for API contract
- `lib/api-client-react/` — generated TanStack Query hooks (Orval output)
- `lib/api-zod/` — generated Zod validators (Orval output)
- `lib/db/src/schema/` — Drizzle schema (students, exams, test_traps tables)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/api-server/src/lib/ai.ts` — AI provider abstraction
- `artifacts/taranom/src/App.tsx` — main frontend app (state-driven views, no page routing)
- `artifacts/taranom/src/views/` — all view components

## Architecture decisions

- State-driven view switching (no wouter routes) — all views share the same `/` path, switched by React state
- Cookie-based session auth — signed cookie with in-memory session map; studentId stored server-side
- AI provider abstraction — `callAI()` / `callAIJson()` switch between Gemini and OpenAI-compatible APIs (GapGPT) based on `activeProvider`; provider state persisted to `data/active-provider.json`
- Offline fallbacks — all AI routes return sensible Persian fallback responses if AI is unavailable
- RTL-first — `dir="rtl"` on `<html>`, Vazirmatn font, right-to-left layout throughout

## Product

Three user roles: **student** (داشبورد, کارنامه, مشاور AI, تله‌های تستی, انتخاب رشته, روند پیشرفت, سنجش روانشناختی, پروفایل), **parent** (monitoring), **admin** (AI provider management panel).

Demo login: code `demo` (student) or `admin` (admin).

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Sessions are in-memory only; server restart clears all sessions (users must log in again)
- `pnpm --filter @workspace/api-spec run codegen` must be re-run after any OpenAPI spec changes
- Google Gemini key must be set as `GEMINI_API_KEY` secret; admin panel also allows runtime key swap
- The `data/` directory (provider state JSON) is gitignored

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
