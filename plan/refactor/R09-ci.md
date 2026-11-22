# R09: Monorepo CI/CD

**Goal:** Extend existing branch/PR quality gates to validate all workspace packages and preserve protected-main deployment behavior.

## Tasks

- Keep feature-branch push and PR-to-main triggers; preserve the required `quality` status check.
- Run reproducible install, lint, typecheck, unit tests, service integration tests, builds for web/BFF/vendor, and Playwright E2E.
- Start vendor and BFF services for integration/E2E workflows and use deterministic scenarios.
- Upload Playwright reports/traces on success/failure as configured.
- Keep deployment triggered only after successful CI on `main`; never deploy feature branches or PRs.

## Acceptance criteria

- A failure in any workspace or E2E step blocks merge/deployment.
- Root scripts provide one documented full-verification command.
- Existing required branch-protection check name remains stable or is deliberately updated in repository settings and verified.
