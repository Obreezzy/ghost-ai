# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- 05-prisma.md (in progress)

## Current Goal

- Add project metadata models and configure Prisma 7 correctly for migrations

## Completed

- Boilerplate cleanup (globals.css, page.tsx, SVGs removed)
- Design System (01-design-system.md)
  - shadcn/ui components installed: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea
  - lucide-react installed for icons
  - cn() utility created in lib/utils.ts
  - All components configured with dark theme
  - Build verified - no errors
- Token utilities wired in globals.css via @theme inline (Tailwind v4 renders shadcn HSL tokens as bg-background / text-foreground / border-input, etc.)
- Editor Chrome (02-editor.md)
  - `components/editor/editor-navbar.tsx` — fixed h-14 navbar, left/center/right sections, sidebar toggle with PanelLeftOpen/PanelLeftClose, right section empty, bg-background + border-input
  - `components/editor/project-sidebar.tsx` — fixed-position floating sidebar (slides from left via translate-x), Projects header + close button, Tabs (My Projects / Shared) with placeholder empty states, full-width New Project button with Plus icon
  - Dialog component restyled to use globals.css color tokens (bg-background, border-input, text-foreground, ring-ring, text-muted-foreground) — title/description/footer pattern ready; no concrete dialogs built yet (per spec)
  - Chrome mounted in app/page.tsx with toggle state
  - app/layout.tsx body + metadata updated to token colors and Ghost AI branding
  - Verified: tsc --noEmit clean, eslint clean on new files, token utilities compile, dev server renders components (HTTP 200)
  - Chrome moved to `app/editor/page.tsx` in the auth unit (see below)
- Authentication (03-auth.md)
  - `@clerk/ui@1.34.0` installed; `dark` theme applied as base via `appearance.theme` on `ClerkProvider`
  - Clerk appearance variables overridden with app CSS tokens (`hsl(var(--background))`, `hsl(var(--foreground))`, `hsl(var(--input))`, `hsl(var(--muted))`, `hsl(var(--muted-foreground))`, `hsl(var(--primary))`, `hsl(var(--primary-foreground))`, `hsl(var(--destructive))`, `hsl(var(--ring))`) — no hardcoded colors
  - `.env.local` — added existing Clerk env var names `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
  - `proxy.ts` (Next.js 16, replaces middleware.ts) — protected-first `clerkMiddleware`: `/` and the sign-in/sign-up env var paths are public, everything else calls `auth.protect()`
  - `app/layout.tsx` — root layout wrapped with `ClerkProvider` (dark theme + token appearance)
  - `app/(auth)/layout.tsx` — two-panel layout: left = compact Ghost logo + tagline + text-only feature list (lg+ only), right = centered Clerk form; form-only on small screens; no gradients/hero/feature cards/scroll-heavy layout
  - `app/(auth)/sign-in/[[...rest]]/page.tsx` and `app/(auth)/sign-up/[[...rest]]/page.tsx` — render Clerk `<SignIn />` / `<SignUp />` as optional catch-all routes (required for Clerk's internal sub-flow routes, e.g. `/sign-in/forgot-password`)
  - `app/page.tsx` — auth-state redirect: authenticated → `/editor`, unauthenticated → `/sign-in`
  - `app/editor/page.tsx` — editor chrome moved here from `/` (protected by proxy)
  - `components/editor/editor-navbar.tsx` — Clerk `<UserButton />` in the right section (default menu, default flows intact)
  - Auth UI polish (per user request, matching `Desktop/Ghost AI doc.docx` mockup): true 50/50 split — left panel (Ghost logo, wordmark, headline, tagline, feature list with brand-cyan check icons) on `bg-surface` (#15151a), right panel (centered Clerk form) on pure-black `bg-base`; small screens show form only. The sign-in/sign-up box is larger (`max-w-[28rem]` wrapper + Clerk `elements.cardBox/card/scrollBox` width 100%) and interactive — glowing cyan shadow on hover (`hover:shadow-[0_0_48px_-12px_var(--accent-primary)]`), logo hover lift, feature rows brighten/scale their icons, `transition` rules on Clerk inputs and primary button, and a cyan primary submit button (Clerk `colorPrimary: var(--accent-primary)` with dark text, scoped to the auth pages so the editor `UserButton` keeps the default). The mockup was analyzed via pixel extraction (no image/OCR access): 1920×1080, black throughout with a subtly lighter left half, bright-cyan action block (#00c8d4-family) centered on the right, small gray wordmark top-left. Fonts corrected to Geist per ui-context.md: `body` uses `var(--font-geist-sans)` (was falling back to system font — the next/font variable was defined but never applied), `--font-sans`/`--font-mono` mapped to the Geist variables in `@theme inline`, and Clerk's own form font set via `appearance.variables.fontFamily` to `var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif`.
  - Verified: `tsc --noEmit` clean (build passes), dev-render `/sign-in` 200 with `bg-surface`/`bg-base`/min-h-dvh classes and `font-family:var(--font-geist-sans)` rule present in compiled CSS
  - Verified: `tsc --noEmit` clean, `eslint` clean on new files (only the 2 pre-existing foundation errors remain), `npm run build` passes (Proxy detected, routes `/`, `/editor`, `/sign-in`, `/sign-up`), dev-render checks: `/` → 307 to `/sign-in`, `/editor` → 307 to `/sign-in?redirect_url=...`, `/sign-in` and `/sign-up` → 200
   - Resolved the root route merge conflict: `app/page.tsx` now keeps the auth-based redirect, while editor chrome remains in `app/editor/page.tsx`.
   - Added `/sign-in` and `/sign-up` fallbacks to the Clerk public-route matcher when deployment environment variables are unset.
- Fixed the still-valid generated UI lint issue by changing the empty `InputProps` and `TextareaProps` interfaces to exported type aliases preserving the same HTML attribute contracts.
- Added the Tailwind v4 class-based dark variant in `app/globals.css` via `@custom-variant dark` so `dark:*` utilities follow the app's `.dark` root class instead of device preference.
- Intentionally skipped the requested ESLint override because it would keep the empty-object lint problem in place and contradict the actual fix.
- Prisma chapter (in progress)
  - `prisma/models/project.prisma` created with `Project` and `ProjectCollaborator` models, required indexes, unique constraints, and cascade relation.
  - `lib/prisma.ts` created with the Prisma client singleton and `DATABASE_URL` branch handling for Accelerate vs. direct Postgres.
  - Prisma 7 schema config corrected to the supported pattern: connection URL is not stored in `schema.prisma`; runtime config is provided via `prisma.config.ts` and the client constructor.

## In Progress

- 05-prisma.md
  - Add or confirm the Prisma project metadata models and resolve the v7 config migration path.
  - Re-run `prisma validate`, generate the client, apply the migration, and verify the project build.

## Next Up

- Complete and verify 05-prisma.md

## Open Questions

- None at this stage; the Prisma v7 config change is the required compatibility fix and it is now applied.

## Architecture Decisions

- Prisma 7 uses a config-based datasource URL flow instead of schema-level `datasource.url`; migration config is defined in `prisma7.config.ts` and the DB URL is passed through `PrismaClient` runtime options or `prisma.config.ts`.
- Project schema will use PostgreSQL with the direct adapter path unless a Prisma Accelerate URL is supplied.

## Session Notes

- Prisma 7 requires `datasource.url` to move out of `schema.prisma` and into `prisma.config.ts` / runtime, which is the current fix being verified.
- `prisma/models/project.prisma` remains the canonical schema fragment for the `Project` and `ProjectCollaborator` models.