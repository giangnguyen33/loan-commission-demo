# Loan Commission Quote Demo Tasks

This folder breaks the requirements in `../AGENTS.md` into ordered, independently trackable task briefs. Work in order; do not begin T04 until the initial CI/CD workflow and deployment have been verified.

## Stages

| Stage | Tasks | Gate |
|---|---|---|
| 1. Repository and foundation | [T01](T01-repository-setup.md), [T02](T02-react-foundation.md) | Local app, tests, lint, typecheck, and build pass. |
| 2. CI/CD baseline | [T03](T03-ci-cd.md) | Initial CI passes and GitHub Pages deployment is verified before feature work. |
| 3. Application features | [T04](T04-api-contract.md) through [T09](T09-loading-errors-retry.md) | Each task's implementation and tests pass before moving on. |
| 4. End-to-end and release verification | [T10](T10-e2e-testing.md), [T11](T11-final-verification.md) | Full checks pass; deployed demo and documentation are verified. |

## Required workflow for T04–T09

1. Implement the feature and its unit/component tests together.
2. Cover success, failure, and relevant edge cases.
3. Run the focused tests, then `npm run typecheck` and `npm run lint`.
4. Fix failures and record the task status only after its acceptance criteria pass.

T10 adds deterministic Playwright journeys to CI. Deployment must run only after all required checks pass on `main`.

## Shared constraints

- Stack: React, TypeScript, Vite, MSW, Vitest, React Testing Library, Playwright, npm, GitHub Actions, GitHub Pages.
- No backend, database, AWS infrastructure, unnecessary dependencies, or additional business features.
- Keep API contracts separate from UI components and MSW handlers separate from application logic.
- Never expose real vendor API keys. The browser-side MSW key check is a demo simulation, not production security.
- Overall estimate from the source plan: 3 hours 30 minutes.
