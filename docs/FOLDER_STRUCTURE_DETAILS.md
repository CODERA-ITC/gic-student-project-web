# Folder Structure Details

This document explains the current folder layout of `Frontend/gic-student-project-web` and what each area is responsible for.

## Root Overview

Main project folders/files (current):

- `app/` - Nuxt application source (pages, components, stores, middleware, services, etc.)
- `assets/` - global styles and static style assets used by Nuxt build
- `i18n/` - locale files (`en.json`, `kh.json`)
- `public/` - public static assets served directly
- `server/` - server-side endpoints/utilities (Nuxt server runtime)
- `docs/` - internal project documentation
- `types/` - shared TypeScript types
- `nuxt.config.ts` - Nuxt runtime/build configuration
- `package.json` - scripts and dependencies

## `app/` Structure (Nuxt App Source)

### `app/pages/`

Nuxt file-based routing. Every file becomes a route.

Examples:

- Public:
  - `app/pages/index.vue`
  - `app/pages/projects/index.vue`
  - `app/pages/projects/[id].vue`
- Student:
  - `app/pages/student/dashboard/index.vue`
  - `app/pages/student/my-projects/index.vue`
  - `app/pages/student/submissions/index.vue`
- Teacher:
  - `app/pages/teacher/dashboard/index.vue`
  - `app/pages/teacher/submissions/index.vue`
  - `app/pages/teacher/user-management/index.vue`
- Admin:
  - `app/pages/admin/dashboard/index.vue`
  - `app/pages/admin/projects/index.vue`
  - `app/pages/admin/users/index.vue`

Use this folder for route-level screens only.

### `app/components/`

Reusable UI building blocks and feature components.

Current examples:

- Generic UI:
  - `LoadingSpinner.vue`
  - `DeleteConfirmationModal.vue`
  - `SearchBar.vue`
- Domain UI:
  - `ProjectCard.vue`
  - `StudentCard.vue`
  - `UserFormModal.vue`
- Namespaced folders:
  - `components/admin/`
  - `components/app/`
  - `components/auth/`
  - `components/buttons/`
  - `components/profile/`

Guideline:

- Keep route orchestration in `pages/`
- Extract reusable pieces into `components/`

### `app/stores/`

Pinia stores for app state and business flows.

Current stores:

- `auth.ts`
- `projects.ts`
- `students.ts`
- `admin.ts`
- `ui.ts`
- `theme.ts`
- `analytics.ts`
- `project-meta.ts`

See `docs/STATE_MANAGEMENT_DETAILS.md` for details.

### `app/services/`

API/service layer. Encapsulates HTTP calls and data transformation.

Current services:

- `AuthService.ts`
- `ProjectService.ts`
- `StudentService.ts`

Typical pattern:

- `page/component` -> `store action` -> `service method` -> API

### `app/middleware/`

Route guards and role checks.

Current middleware:

- `auth.ts`
- `guest.ts`
- `student.ts`
- `teacher.ts`
- `admin.ts`
- `role.ts`

See `docs/MIDDLEWARE_DETAILS.md`.

### `app/layouts/`

Nuxt layouts shared across pages (wrapper shells/navigation).

Use when multiple routes need the same structural frame.

### `app/composables/`

Reusable composition helpers (`useXxx`) for logic shared across components/pages.

### `app/plugins/`

Nuxt plugins (bootstrapping app-level integrations).

### `app/utils/`, `app/lib/`, `app/constants/`

- `utils/` - helper functions
- `lib/` - lower-level utilities / integrations
- `constants/` - static config lists, icon maps, etc.

## Recommended Placement Rules (for future work)

### Add a new screen/page

- Put in `app/pages/...`
- Add `definePageMeta({ middleware: [...] })` if protected

### Add reusable UI

- Put in `app/components/...`
- If domain-specific, create/extend a subfolder (e.g. `components/profile/`)

### Add API logic

- Put request logic in `app/services/...`
- Call it from a store action, not directly from many pages

### Add app state

- Prefer a Pinia store in `app/stores/...`
- Keep state mutations and async flows centralized

### Add route protection

- Reuse existing middleware in `app/middleware/...`
- Use `role.ts` for flexible role combinations if needed

## Route Organization Notes

The project currently uses clear role-based route grouping:

- `student/*`
- `teacher/*`
- `admin/*`

This is good for:

- access control
- navigation consistency
- role-specific feature growth

## Maintenance Tips

- Keep page files focused on UI orchestration; move complex logic to stores/composables
- Reuse modal/components across roles when behavior is similar (example: reset password flow)
- Document any new top-level folder in `README.md` and here when introduced
