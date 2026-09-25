# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Canvas Workspace (next editor unit)

## Current Goal

- Build the project card/canvas workspace on top of the protected editor chrome

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

## In Progress

- None

## Next Up

- Canvas workspace (project cards, project detail/canvas route)

## Open Questions

- ui-context.md describes a richer token vocabulary (--bg-base, text-copy-primary, border-surface-border, --accent-ai, --accent-primary, etc.) that did not exist in globals.css. Partially addressed during the auth UI polish: the ui-context colors were added to globals.css `.dark` and mapped via `@theme inline` (`--color-base`, `--color-surface`, `--color-copy-*`, `--color-brand`, `--color-ai`, `--color-accent-dim`, `--color-state-*`, etc.) on top of the existing shadcn HSL tokens, so both vocabularies are available. The shadcn tokens remain the source for Clerk appearance variables and shadcn components; a future chapter can decide whether to fully migrate to the ui-context names.
- The sign-in mockup screenshot could not be inspected (the model has no image input). The initial left-panel accent was the AI indigo from ui-context.md, which the user replaced with a black background throughout; the exact visual details of the screenshot beyond that (spacing, copy, iconography) may still differ from the current implementation.
- `npm run lint` reports pre-existing errors in generated foundation files `components/ui/input.tsx` and `components/ui/textarea.tsx` (empty interface). These are protected third-party components; not modified. Decide in a future chapter whether to fix them.

## Architecture Decisions

- Tailwind v4: shadcn tokens are exposed by mapping the HSL custom properties in globals.css to Tailwind color tokens via `@theme inline`. The v3-style `tailwind.config.ts` is not loaded by Tailwind v4 and is no longer the source of truth for color utilities.
- Editor chrome floats over the canvas: sidebar uses fixed positioning (top-14, not pushing page content), navbar is a fixed h-14 header mounted above the workspace.
- New Project button, tab triggers, and sidebar close button are present but intentionally non-functional; card/canvas pages wire them up in later chapters.
- Route protection uses Next.js 16 `proxy.ts` (formerly `middleware.ts`) with `clerkMiddleware`, protected-first: only `/` and the sign-in/sign-up env paths are public.
- Clerk appearance: `dark` base theme from `@clerk/ui/themes` with color variables mapped to the app's shadcn HSL tokens wrapped in `hsl()` (the raw tokens are HSL triplets; utilities use the same pattern, e.g. `.bg-background { background-color: hsl(var(--background)) }`). No hardcoded hex values in app code.
- Auth pages live in an `app/(auth)` route group so they share a two-panel layout without adding a URL segment; public routes stay `/sign-in` and `/sign-up`.

## Session Notes

- `next build` was previously blocked because `next/font/google` fetches Geist woff2 from fonts.gstatic.com, which timed out. During this session network access recovered, so the font fetch completed and `npm run build` passes. Re-check if the network blocks return.
- npm registry access is flaky: HEAD/packument requests work but large tarball downloads and full `npm install` of `@clerk/ui` stall (its transitive tree pulls react-native, @solana/web3.js, etc., which are not in the offline cache). Workaround for this unit: `@clerk/ui@1.34.0` was installed by downloading `ui-1.34.0.tgz` via ranged `curl` resume and extracting it into `node_modules/@clerk/ui`; `"@clerk/ui": "^1.34.0"` was added to package.json manually.
- LOCKFILE RECONCILED (2026-09-23): an `npm install --no-audit --no-fund` ran to completion after the network recovered long enough to fetch the full `@clerk/ui` tree. `package-lock.json` now contains `@clerk/ui@1.34.0` and its transitive deps (react-native, @solana/*, @emotion/*, input-otp, qrcode.react, core-js, etc.). Verification after install: `npx tsc --noEmit` passes and `npm run build` passes (Proxy detected, routes `/`, `/editor`, `/sign-in`, `/sign-up`). Also note: early retries of this install failed with ECONNRESET (network reset) and Windows EPERM cleanup errors while the dev server held file locks; the successful run eventually completed in ~8m and also re-resolved some existing entries (package-lock shows 5333 insertions / 242 deletions vs. the pre-auth baseline).
- Runtime error fix (2026-09-23): the Clerk `<SignIn/>`/`<SignUp/>` components threw "is not configured correctly" because `/sign-in` and `/sign-up` were plain routes, not catch-alls. Fixed by nesting `[[...rest]]` under each page folder (`app/(auth)/sign-in/[[...rest]]/page.tsx`, same for sign-up). The proxy already made `/sign-in(.*)`/`/sign-up(.*)` public. Verified: `npm run build` passes; dev log shows Clerk's internal `catchall_check` returning 200; `/sign-in`, `/sign-in/forgot-password`, `/sign-up` → 200, `/` and `/editor` → 307 to `/sign-in`. Restarting the dev server was required for the new route folder to be picked up (Turbopack doesn't always hot-add route segments), so the stale server was restarted on :3000.
- The Clerk SDK in this project (v7.9.5) is Core 3: `auth()` from `@clerk/nextjs/server` returns `isAuthenticated`, and `clerkMiddleware` handlers receive an `auth` object with `auth.protect()` (not `auth().protect()`). `UserButton` no longer accepts `afterSignOutUrl` — the default sign-out menu is used.