# T11 – Final Verification

**Objective:** Verify the local app, automated quality gates, and public deployment.

## Tasks
- Verify the local application.
- Run unit tests, E2E tests, lint, typecheck, and production build.
- Verify GitHub Actions and GitHub Pages deployment.
- Verify the deployed MSW API behavior.
- Add the demo URL and complete deployment information to `README.md`.

## Acceptance criteria
- Local app works; all automated checks and CI pass; public demo URL works; documentation is complete.

## Final CI quality gates
1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run test:unit`
5. `npm run build`
6. `npm run test:e2e`

Deployment runs only after required checks pass on `main`.

## Dependencies
- T10.
