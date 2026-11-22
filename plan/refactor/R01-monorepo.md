# R01: Monorepo Structure

**Goal:** Introduce npm workspaces without recreating or losing the completed React app.

## Migration map

- Move the existing Vite/React application (`src`, `index.html`, `public`, Vite config, and app-specific TS config) to `apps/web`.
- Create workspace roots for `apps/bff`, `apps/vendor`, and `packages/contracts`; retain the existing OpenAPI document and generated types until the shared Zod contract is established.
- Keep root lint/test/build/dev scripts as workspace orchestrators or compatibility aliases so current developer commands remain usable.
- Keep existing app components, frontend models, styles, unit tests, Playwright tests, and MSW tests during migration.

## Tests and verification

- Preserve the existing unit/component/E2E test suites; update only paths/configuration affected by moving the web app.
- Verify `npm ci`, root lint/typecheck/unit/build scripts, and Chromium E2E work from the monorepo root.
- Add a workspace smoke test that proves each package is discoverable and scripts target the intended workspace.

## Acceptance criteria

- npm workspaces install reproducibly from one lockfile.
- Existing quote form, results, accessible loading/retry, and tests still work.
- No backend/business behavior is silently removed during file moves.
