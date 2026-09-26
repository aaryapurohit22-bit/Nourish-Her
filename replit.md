# Nourish Her

A frontend-only women’s health and wellness companion with guided onboarding, cycle insights, nutrition planning, and supportive care journeys.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/nourish-her run dev` — run the web app through its managed workflow
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/nourish-her/src/App.tsx` — page routing, shared shell, mock data, and screen-level UI
- `artifacts/nourish-her/src/index.css` — Nourish Her visual system, responsive layout, typography, and motion
- `artifacts/nourish-her/package.json` — web artifact scripts and client-side dependencies

## Architecture decisions

- The first release is frontend-only and uses local mock state; backend, database, and authentication are intentionally deferred.
- All requested screens share one responsive application shell and navigation model so the product reads as one care experience.
- The visual language uses mineral teal, warm paper, and a restrained terracotta accent with DM Sans and Fraunces for a calm, editorial health-tech tone.

## Product

Nourish Her gives women a private, supportive place to understand cycle patterns, plan food and movement, access PCOS/PCOD and menopause guidance, and see progress over time.

## User preferences

- Keep the experience professional, spacious, responsive, and trustworthy.
- Avoid childish or overly feminine visuals, excessive pink, hearts, flowers, glitter, emojis, and cartoon graphics.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
