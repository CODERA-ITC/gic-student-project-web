# State Management Details

This document describes how state management works in the frontend and what each Pinia store is responsible for.

## Overview

The project uses **Pinia** (`@pinia/nuxt`) for centralized state.

State flow pattern (common):

1. Page / component triggers an action
2. Store action calls a service (`AuthService`, `ProjectService`, `StudentService`, etc.)
3. Store updates state
4. UI reacts through computed bindings / getters

## Store Inventory

Current store files in `app/stores/`:

- `auth.ts`
- `projects.ts`
- `students.ts`
- `admin.ts`
- `ui.ts`
- `theme.ts`
- `analytics.ts`
- `project-meta.ts`

## Core Stores

### `app/stores/auth.ts` (`useAuthStore`)

Purpose:

- Authentication state
- Current user profile and role
- Token validation / refresh flow
- Login/register/OAuth callbacks
- Profile update flows and security questions

Key state (high level):

- `user`
- `isAuthenticated`
- `isLoading`
- `isRefreshing`
- `refreshPromise` (prevents duplicate refresh calls)
- `error`
- `needsSecurityQuestions`

Key getters:

- `isStudent`
- `isTeacher`
- `isAdmin`
- `currentUser`
- `userRole`
- `token`
- role-specific typed getters (`studentProfile`, `teacherProfile`, `adminProfile`)

Important actions (examples):

- `login(...)`
- `register(...)`
- `restoreAuth()`
- `refreshAccessToken()`
- `fetchCurrentUser()`
- `handleOAuthCallback(...)`
- `makeAuthRequest(...)`
- `updateUserProfile(...)`
- `uploadAvatar(...)`
- `submitSecurityQuestions(...)`
- `changePassword(...)`

Notes:

- Middleware relies heavily on this store for auth and role checks.
- Token refresh is handled in-store and reused by middleware/pages.

### `app/stores/projects.ts` (`useProjectStore`)

Purpose:

- Main project catalog and project detail state
- Project CRUD
- Project submissions/review workflow
- Likes/views/highlights
- Categories/tags/courses cache for project forms/listing

Common usage areas:

- Public project pages
- Student project creation/editing
- Teacher review submissions
- Admin project management

Important actions (examples):

- Metadata/listing:
  - `fetchCategories()`
  - `fetchTags()`
  - `fetchCourses()`
  - `fetchProjects(...)`
  - `searchProjects(...)`
- Project interactions:
  - `likeProject(...)`
  - `incrementViews(...)`
  - `hasUserLikedProject(...)`
  - `hasUserViewedProject(...)`
- Project detail:
  - `fetchProjectById(...)`
  - `getProjectById(...)`
- Student project ownership:
  - `createProject(...)`
  - `updateProject(...)`
  - `deleteProject(...)`
  - `fetchUserProjects()`
  - `fetchUserSubmissions()`
  - `submitProjectForReview(...)`
- Teacher/admin review:
  - `fetchAllSubmissions()`
  - `acceptProject(...)`
  - `rejectProject(...)`
  - `updateProjectStatus(...)`
  - `updateProjectVisibility(...)`
  - `markProjectAsHighlighted(...)`

Notable getters/utilities:

- category/tag/course object helpers
- `getSimilarProjects()`
- highlighted/popular project selectors
- submission project selectors

### `app/stores/students.ts` (`useStudentStore`)

Purpose:

- Student directory state
- Internal student management state (teacher/admin usage)
- Pagination, generation filtering, search
- Student CRUD + CSV import

Key state concepts:

- `apiStudents`
- `loading`
- pagination (`currentPage`, `limit`, `total`, `lastPage`)
- filters (`selectedGeneration`, `searchQuery`)
- `availableGenerations`

Important actions:

- `loadStudents(token)`
- `loadInternalStudents(token)`
- `changePage(page, token)`
- `setGeneration(...)`
- `setSearchQuery(...)`
- `createStudent(studentData, token)`
- `updateStudent(studentId, studentData, token)`
- `deleteStudent(studentId, token)`
- `uploadStudentsCSV(file)`
- `searchStudentsWithResults(query)`

Recent usage note:

- Teacher `user-management` now uses this store for student password reset via `updateStudent(..., { password })`.

### `app/stores/admin.ts` (`useAdminStore`)

Purpose:

- Admin dashboards and management data
- User management (all roles)
- Admin-side project management
- Counts/KPIs
- Course-teacher assignment flows

Important actions (examples):

- `fetchCounts()`
- `fetchUsers(...)`
- `fetchUserById(...)`
- `createUser(...)`
- `updateUser(...)`
- `updateUserRole(...)`
- `deleteUser(...)`
- `uploadUsersCSV(...)`
- `fetchProjects(...)`
- `fetchTeachersForCourseAssignments()`
- `assignTeacherCourse(...)`
- `removeTeacherCourse(...)`

Notes:

- Admin pages should use this store instead of directly calling services from page components.

## UI / Support Stores

### `app/stores/ui.ts` (`useUiStore`)

Purpose:

- UI state shared across the app (notifications, modals, UI flags)

Examples:

- global modal state
- notification state
- convenience getters like `hasNotifications`, `hasActiveModals`

### `app/stores/theme.ts` (`useThemeStore`)

Purpose:

- Theme mode state (light/dark)
- Browser storage persistence
- Applying theme classes to the document

Key actions:

- `initialize()`
- `toggle()`
- `setTheme(...)`
- `applyTheme()`
- `saveToStorage()`

### `app/stores/analytics.ts` (`useAnalyticsStore`)

Purpose:

- Client-side user interaction analytics/state tracking
- Saved/liked/view history counters and related computed metrics

### `app/stores/project-meta.ts` (`useProjectMetaStore`)

Purpose:

- Admin/manageable metadata resources for projects (categories, courses, tags)
- Shared loading/pagination state per resource type

Key actions (examples):

- `fetchCategories(...)`
- `fetchCourses(...)`
- `fetchTags(...)`
- `deleteItem(resource, id)`

## State Management Conventions (Current + Recommended)

### What to put in a store

- Shared data used across multiple pages/components
- Async flows that call APIs
- State that needs persistence during route changes

### What not to put in a store

- One-off local UI state for a single component (use `ref` in component)
- Purely presentational toggles that never leave one component

### Preferred data flow

- `page` handles route/view concerns
- `store` handles business state and async actions
- `service` handles API request details

## Common Patterns in This Codebase

### 1. Token-aware actions

Some stores (especially `students.ts`) receive `token` explicitly:

- `loadStudents(token)`
- `updateStudent(..., token)`

This is useful for clear call sites but requires pages to pass `authStore.token`.

### 2. Role-aware UI via `authStore`

Role checks are usually done using:

- `authStore.isStudent`
- `authStore.isTeacher`
- `authStore.isAdmin`

These getters are also used by middleware.

### 3. Refresh/reload after mutation

After create/update/delete actions, pages often:

- close modal
- show toast
- reload list from store

This is consistent and easy to maintain.

## Maintenance Notes / Future Improvements

- Standardize whether token is passed into store actions vs read internally
- Extract repeated table-list page patterns into shared composables
- Add lightweight store docs/comments when introducing large new actions
- Consider tests for auth refresh and role-based flows (highest impact)
