# GIC Student Project Web

Nuxt 4 frontend for the GIC Student Project platform.

It includes public project browsing plus role-based dashboards and management flows for `student`, `teacher`, and `admin`.

## Main Purpose

The main purpose of this project is to provide a single web platform where:

- students can create, manage, and submit their academic projects
- teachers can review submissions and manage student records
- admins can manage projects, users, and project metadata (categories/tags/courses)
- visitors can browse student projects and discover work from GIC students

It serves as the frontend application for showcasing student work and supporting the full project review/management workflow.

## Tech Stack

- Nuxt 4
- Vue 3
- Pinia
- `@nuxt/ui`
- `@nuxt/image`
- `@nuxtjs/i18n` (English / Khmer)
- Tailwind CSS
- TypeScript (typecheck script available)

## Requirements

- Node.js 18+ (LTS recommended)
- npm (examples below use npm)

## Install

```bash
cd Frontend/gic-student-project-web
npm install
```

## Environment / API

The app uses `runtimeConfig.public.apiBase` in `nuxt.config.ts`.

- Current default: `""` (empty)
- This works when your frontend can call backend endpoints through the same origin/proxy (`/api/...`)

If your backend runs on another host/port, set:

```bash
NUXT_PUBLIC_API_BASE=http://localhost:3017 npm run dev
```

## Development

```bash
npm run dev
```

Default dev server uses HTTPS via local certs in `nuxt.config.ts`:

- `localhost.key`
- `localhost.crt`

Other useful scripts:

```bash
npm run dev:watch
npm run dev:debug
npm run dev:force
```

## Build / Preview

```bash
npm run build
npm run preview
```

Static generation (if needed):

```bash
npm run generate
```

## Quality / Maintenance

```bash
npm run lint
npm run lint:fix
npm run typecheck
npm run clean
```

## Project Structure (Key Areas)

- `app/pages/` - Nuxt routes
- `app/components/` - reusable UI/components
- `app/stores/` - Pinia stores (auth, projects, students, admin, etc.)
- `app/services/` - API service layer
- `assets/css/main.css` - global styling
- `i18n/locales/` - translation files (`en.json`, `kh.json`)
- `nuxt.config.ts` - modules, dev HTTPS, runtime config

## Main Routes (Current)

### Public

- `/`
- `/projects`
- `/projects/search`
- `/projects/[id]`
- `/students`
- `/students/[id]`
- `/about`
- `/privacy`
- `/terms`
- `/login`
- `/signup`
- `/forgot-password`

### Student

- `/student/dashboard`
- `/student/my-projects`
- `/student/my-projects/[id]`
- `/student/my-projects/[id]/edit`
- `/student/submissions`
- `/student/favorites`

### Teacher

- `/teacher/dashboard`
- `/teacher/submissions` (review submissions)
- `/teacher/submissions/[id]`
- `/teacher/favorites`
- `/teacher/user-management`

### Admin

- `/admin/dashboard`
- `/admin/projects` (project management)
- `/admin/projects/[id]`
- `/admin/users`
- `/admin/profile`
- `/admin/categories`
- `/admin/tags`
- `/admin/courses`
- `/admin/internal-students`

### Shared Profile / Auth Callbacks

- `/profile`
- `/auth/callback`
- `/users/google/callback`
- `/users/github/callback`

## Functional Highlights (Current)

- JWT auth + role-based route guards (`student`, `teacher`, `admin`)
- Project creation/editing with image uploads
- Teacher review workflow (accept/reject submissions)
- Teacher student management (create/edit/delete + reset password)
- Admin project/user/category/tag/course management
- Student project ownership flows (`My Projects`)
- i18n support (English/Khmer)
- Responsive dashboards and management pages (recent updates to teacher tabs)

## Notes for Developers

- Dev HTTPS is enabled by default in `nuxt.config.ts`
- TypeScript strict mode is currently off in `nuxt.config.ts`
- `runtimeConfig.public.apiBase` is intentionally empty by default (proxy/same-origin setup)

## Troubleshooting

- `401` / auth issues:
  - Re-login and verify backend is running
  - Check token/refresh flow from `AuthService`

- API requests failing / `ECONNREFUSED`:
  - Set `NUXT_PUBLIC_API_BASE` to the correct backend URL
  - Confirm backend is reachable

- HTTPS warning in local dev:
  - Trust `localhost.crt` or disable HTTPS in `nuxt.config.ts` for local testing

## Quick Start Checklist

1. Install dependencies: `npm install`
2. Start backend API
3. Set `NUXT_PUBLIC_API_BASE` if backend is not proxied on same origin
4. Run frontend: `npm run dev`
5. Open local app and test role-based flows:
   - student dashboard / my projects
   - teacher dashboard / review submissions / user management
   - admin dashboard / project management
