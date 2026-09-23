# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Canvas Workspace (next editor unit)

## Current Goal

- Frame the editor chrome (02-editor.md) so future chapters can build the canvas on top of it

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

## In Progress

- None

## Next Up

- Canvas workspace (03-* spec, if defined)

## Open Questions

- ui-context.md describes a richer token vocabulary (--bg-base, text-copy-primary, border-surface-border, etc.) that does not exist in globals.css. The implemented design system uses the shadcn HSL tokens (--background, --foreground, --primary, --input, --ring, etc.) mapped via @theme inline. Future chapters should decide whether to migrate globals.css to the ui-context token names or align ui-context.md with the implemented tokens.
- `npm run lint` reports pre-existing errors in generated foundation files `components/ui/input.tsx` and `components/ui/textarea.tsx` (empty interface). These are protected third-party components; not modified. Decide in a future chapter whether to fix them.

## Architecture Decisions

- Tailwind v4: shadcn tokens are exposed by mapping the HSL custom properties in globals.css to Tailwind color tokens via `@theme inline`. The v3-style `tailwind.config.ts` is not loaded by Tailwind v4 and is no longer the source of truth for color utilities.
- Editor chrome floats over the canvas: sidebar uses fixed positioning (top-14, not pushing page content), navbar is a fixed h-14 header mounted above the workspace.
- New Project button, tab triggers, and sidebar close button are present but intentionally non-functional; card/canvas pages wire them up in later chapters.

## Session Notes

- `next build` fails in this environment because `next/font/google` fetches Geist woff2 from fonts.gstatic.com, which times out. This is a network limitation, not a code error; verification is done via `tsc --noEmit`, `eslint`, and Tailwind compilation, plus a manual dev-render check.
- New font/network or a pre-fetched font fallback will be needed later if builds must pass offline.