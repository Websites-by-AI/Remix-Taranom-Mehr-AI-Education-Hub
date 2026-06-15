---
name: Taranom Mehr architecture
description: Key decisions for the ترنم مهر Konkur coaching platform built in this monorepo.
---

## State-driven view routing
All views share `/` path; a `view` React state variable switches between them. No wouter routes in the frontend. Views live in `artifacts/taranom/src/views/`.

**Why:** The original GitHub repo was a SPA with no routing; matching that pattern avoids complexity and works cleanly with Cloudflare Pages (single HTML file).

**How to apply:** Add new views as files in `src/views/`, import in App.tsx, add to the `ViewType` union, and add a nav item.

## Cookie-based session auth
`POST /api/auth/login` sets an `httpOnly` cookie `taranom_session`. Sessions are stored in a `Map<string, {studentId, role}>` in memory in `artifacts/api-server/src/routes/auth.ts`.

**Why:** Simple, zero-dependency auth. No express-session or Redis needed for MVP.

**How to apply:** Read `req.cookies?.taranom_session` and call `getSession()` from auth.ts in any protected route.

## AI provider abstraction
`artifacts/api-server/src/lib/ai.ts` exports `callAI()` / `callAIJson()`. On startup `initDefaultProvider()` picks Gemini (env key) or GapGPT. Active provider is saved to `data/active-provider.json` so it survives restarts.

**Why:** App must work in Iran (where direct Gemini access may be blocked) via GapGPT proxy.

**How to apply:** Always use `callAI()` / `callAIJson()`; never call Gemini SDK directly in routes.

## Offline fallbacks
All AI routes (`/api/ai/*`) catch errors and return sensible Persian text fallbacks. The app is fully functional without a valid AI key — just with static responses.

## Demo credentials
- student: code `demo`
- admin: code `admin`
These are seeded by `pnpm --filter @workspace/scripts exec tsx ./src/seed.ts`.

## GEMINI_API_KEY
Must be set in Replit secrets. Admin panel (`/admin` view) also lets a logged-in admin swap the provider at runtime (saved to disk). The key was provided by the user as `AIzaSyB5ZDKVcqutt9SvKlckwoo4MiqUlxzi-P4` — it should be in Replit secrets, not in code.
