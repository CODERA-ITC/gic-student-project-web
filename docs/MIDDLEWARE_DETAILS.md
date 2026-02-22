# Middleware Details

This document describes the route middleware used in the frontend (`app/middleware/`) and how to apply it on pages.

## Middleware Files (Current)

- `app/middleware/auth.ts`
- `app/middleware/guest.ts`
- `app/middleware/student.ts`
- `app/middleware/teacher.ts`
- `app/middleware/admin.ts`
- `app/middleware/role.ts`

## How Middleware Is Used

Pages declare middleware with `definePageMeta(...)`.

Examples:

```ts
definePageMeta({
  middleware: ["auth", "student"],
});
```

```ts
definePageMeta({
  middleware: ["auth", "admin"],
});
```

```ts
definePageMeta({
  middleware: ["guest"],
});
```

## `auth.ts` (Authentication Guard)

Purpose:

- Protect routes that require login
- Redirect unauthenticated users to login
- Handle token refresh / auth restoration edge cases

Current behavior highlights:

- Skips on server (`import.meta.server`) because local storage is unavailable
- Allows OAuth callback query params (`token`, `refresh_token`) to pass through
- Checks local storage token first (race-condition prevention)
- Refreshes token if expired
- Waits briefly if `authStore.isLoading` before redirecting
- Redirects through `/loading` before `/login` for smoother UI transition

Typical usage:

- Add `middleware: ["auth"]` to any protected page

## `guest.ts` (Guest-only Pages)

Purpose:

- Prevent authenticated users from opening guest-only pages like login/signup

Current behavior:

- If authenticated, redirects to role dashboard:
  - student -> `/student/dashboard`
  - teacher -> `/teacher/dashboard`
  - admin -> `/admin/dashboard`
- Otherwise allows access

Typical usage:

- `/login`
- `/signup`

## `student.ts` (Student Role Guard)

Purpose:

- Restrict student-only routes to student users

Current behavior:

- Restores auth if needed
- Refreshes access token when invalid
- Requires authenticated user
- Redirects unauthorized users:
  - teacher/admin -> role dashboard (current code redirects non-student teacher/admin to teacher dashboard in one branch)
  - fallback -> `/`

Typical usage:

- `/student/dashboard`
- `/student/my-projects`
- `/student/submissions`

## `teacher.ts` (Teacher Role Guard)

Purpose:

- Restrict teacher routes to teachers (and currently admins)

Current behavior:

- Restores auth if needed
- Refreshes access token if invalid
- Requires authenticated user
- Allows:
  - teacher
  - admin (explicitly allowed)
- Redirects students to `/student/dashboard`

Typical usage:

- `/teacher/dashboard`
- `/teacher/submissions`
- `/teacher/user-management`

## `admin.ts` (Admin Role Guard)

Purpose:

- Restrict admin routes to admins only

Current behavior:

- Restores auth if needed
- Refreshes token if needed
- Requires authenticated user
- Allows only admin users
- Redirects:
  - student -> `/student/dashboard`
  - teacher -> `/teacher/dashboard`
  - fallback -> `/`

Typical usage:

- `/admin/dashboard`
- `/admin/users`
- `/admin/projects`
- `/admin/categories`, `/admin/tags`, `/admin/courses`

## `role.ts` (Generic Role-Based Guard)

Purpose:

- Flexible role authorization using page meta (`requiredRoles`)
- Useful when a route supports multiple roles without creating a dedicated middleware

Usage example:

```ts
definePageMeta({
  middleware: ["auth", "role"],
  requiredRoles: ["STUDENT", "TEACHER"],
});
```

Current behavior:

- Requires authenticated user
- Reads `to.meta.requiredRoles`
- Redirects to role-specific dashboard if user role is not allowed

## Recommended Middleware Combinations

### Public page

- No middleware

### Guest-only page

- `["guest"]`

### Any authenticated user

- `["auth"]`

### Student-only page

- `["auth", "student"]`

### Teacher-only page (admins also allowed by current implementation)

- `["auth", "teacher"]`

### Admin-only page

- `["auth", "admin"]`

### Multi-role page

- `["auth", "role"]` with `requiredRoles`

## Route Guarding Flow (Practical)

For a protected page, the common flow is:

1. Middleware checks auth state
2. Middleware restores auth from storage if needed
3. Middleware refreshes token if expired/invalid
4. Middleware checks user role
5. Middleware allows navigation or redirects

## Maintenance Notes / Caveats (Current Code)

- `teacher.ts` intentionally allows admins on teacher pages
- `role.ts` currently redirects admin fallback to `/dashboard` (check if you want `/admin/dashboard` for consistency)
- `student.ts` redirect behavior for non-students should be reviewed for strict role consistency if needed

These are not necessarily bugs, but they are important to know before changing routing rules.

## When Adding a New Protected Page

Checklist:

1. Decide access level (`auth`, `student`, `teacher`, `admin`, or `role`)
2. Add `definePageMeta({ middleware: [...] })`
3. If using `role.ts`, add `requiredRoles`
4. Verify redirect behavior for all roles
5. Test page refresh with expired token (middleware refresh path)
