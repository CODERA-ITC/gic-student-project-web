# GIC Student Project Web (Nuxt 4)

Nuxt 4 + Pinia frontend for the GIC Student Project platform. It consumes the GIC API (default `http://localhost:3017`) for auth, projects, and media.

## Stack at a Glance

- Nuxt 4 (SSR/SPA hybrid) with Vite
- Pinia for state
- @nuxt/ui for UI kit, @nuxt/image for assets
- i18n (English & Khmer)
- TypeScript, ESLint, PostCSS/Tailwind config present

## Prerequisites

- Node 18+ (LTS recommended)
- npm (or pnpm/yarn/bun; commands shown with npm)
- Optional: trust `localhost.crt` if keeping HTTPS dev server on

## Install

```bash
cd Frontend/gic-student-project-web
npm install
```

## Configure API base

`runtimeConfig.public.apiBase` controls where `/api` points. Examples:

```bash
# Typical local API
NUXT_PUBLIC_API_BASE=http://localhost:3017 npm run dev

# If you proxy /api to the backend (e.g., nginx), you can leave this empty
```

Most calls use relative `/api/...`; set the var when the backend lives on a different host/port.

## Run in development

```bash
npm run dev          # https://localhost:3000 (uses localhost.crt/key)
npm run dev:debug    # with inspector
npm run dev:force    # force restart dev server
```

Want HTTP instead? Remove or comment the `devServer.https` block in `nuxt.config.ts`.

## Build & preview

```bash
npm run build
npm run preview      # serve the built site locally
```

## Quality checks

```bash
npm run lint         # ESLint
npm run lint:fix
npm run typecheck    # Nuxt TS checker (script available; TS strict currently off)
```

## Directory landmarks

- `app/pages/` — route files (Nuxt file routing)
- `app/components/` — shared UI (see SecurityQuestionsModal, SearchBar, RoadmapInfographic)
- `app/services/AuthService.ts` — auth/JWT, profile, token refresh helpers
- `app/services/ProjectService.ts` — project CRUD, likes/views, submissions, highlights
- `app/stores/projects.ts` — Pinia store using ProjectService
- `assets/css/main.css` — global styles; @nuxt/ui theme hooks
- `i18n/locales/` — `en.json`, `kh.json`
- `nuxt.config.ts` — HTTPS dev setup, modules, runtime config

## Typical usage patterns

Auth (token-aware request):

```ts
import { authService } from "~/services/AuthService";
const headers = await authService.getAuthHeaders();
const me = await $fetch("/api/users/me", { headers });
```

Projects (with filters):

```ts
import { projectService } from "~/services/ProjectService";
const projects = await projectService.fetchAll({
  page: 1,
  limit: 12,
  search: "ai",
});
```

Create with media:

```ts
await projectService.create({
  name: "Capstone",
  description: "Demo",
  authorId: user.id,
  departmentId: user.departmentId!,
  images: [file1, file2],
});
```

## Key application features (frontend)

- User authentication with JWT + refresh
- Role-based access (student, teacher/admin flows)
- Project create/update/delete with media uploads
- Project browsing, search, likes, views, submissions
- Secure API calls via token headers

## Troubleshooting

- 404/ECONNREFUSED → check `NUXT_PUBLIC_API_BASE` matches your backend URL.
- HTTPS warning → trust `localhost.crt` or disable HTTPS in `nuxt.config.ts`.
- 401 after idle → refresh token may be invalid; login again. AuthService auto-refreshes when possible.

## Handy scripts (package.json)

- `dev`, `dev:debug`, `dev:force`
- `build`, `preview`, `generate`
- `lint`, `lint:fix`, `typecheck`, `clean`

## Onboarding checklist

- Install deps and set `NUXT_PUBLIC_API_BASE`
- Run backend (separate repo folder) so `/api` resolves
- `npm run dev` and open https://localhost:3000
- Verify login/signup, project listing, and media upload flows
