# Frontend + MSW to BFF Refactor

## Objective

Evolve the existing quote demo incrementally into:

```text
React/Vite web app -> Fastify BFF -> Fastify vendor simulator
```

The BFF is the only service the browser calls. It validates the frontend contract, calls the independent vendor simulator over HTTP, and maps vendor failures to stable frontend errors. The vendor API key is server-only and must never be bundled into the web app.

## Current baseline

T01-T11 are complete on `main`. The existing React form, quote result, accessible loading state, validation, retries, frontend-owned models, OpenAPI contract, Vitest/RTL tests, deterministic MSW scenarios, Playwright Chromium tests, and GitHub Actions/Pages deployment are to be preserved while migrating.

## Migration plan

| Phase | Task | Gate |
|---|---|---|
| Foundation | [R01 workspace structure](plan/refactor/R01-monorepo.md) | Existing web app still builds/tests after workspace conversion. |
| Contracts | [R02 shared contracts](plan/refactor/R02-contracts.md) | Zod contracts, inferred types, and contract tests pass. |
| Services | [R04 vendor simulator](plan/refactor/R04-vendor-simulator.md), [R05 vendor client](plan/refactor/R05-vendor-client.md), then [R03 BFF](plan/refactor/R03-bff.md) | Vendor and BFF unit/integration tests pass; services communicate over HTTP. |
| Web migration | [R06 frontend](plan/refactor/R06-frontend.md), [R07 error handling](plan/refactor/R07-error-handling.md) | Browser calls only BFF; existing user journeys and UI behavior remain. |
| Quality gates | [R08 E2E](plan/refactor/R08-e2e.md), [R09 CI/CD](plan/refactor/R09-ci.md) | Full local and CI checks pass; deploy remains gated on green CI. |
| Release | [R10 deployment](plan/refactor/R10-deployment.md) | Hosting, secrets, routing, and deployed end-to-end flow are verified. |

Task numbering follows the requested requirements with the duplicate R01 normalized to R02 and the malformed R1-0 normalized to R10. Detailed tasks are indexed in [`plan/refactor/README.md`](plan/refactor/README.md).

## Architecture and migration constraints

- Preserve existing application behavior and Git history; move/reorganize files rather than recreating the frontend.
- Keep `src/models/commissionQuote.ts` as the frontend-owned model layer. Keep generated OpenAPI types and wire mapping at service boundaries.
- Replace browser MSW as the runtime vendor simulation only after the standalone vendor and BFF are integrated. Retain applicable MSW handler tests during transition, then remove obsolete browser service-worker assets/config once no longer used.
- Use npm workspaces with `apps/web`, `apps/bff`, `apps/vendor`, and `packages/contracts`; use TypeScript and Zod across server/contracts, Fastify for both servers, Vitest for unit/integration tests, and Playwright for E2E.
- Each development task adds/updates tests alongside code, runs focused tests, then full typecheck/lint/build for affected packages.
- Never expose vendor credentials or deterministic failure controls in browser bundles or production endpoints.

## Deployment decision gate

GitHub Pages can host only the static web app, not Fastify services. Recommended demo topology is GitHub Pages for `apps/web` plus separately hosted BFF and vendor service endpoints. The BFF must allow only the Pages origin (or use same-origin proxying if the selected host supports it); the vendor should be private to the BFF where supported. Choose the BFF/vendor hosting provider and public URL arrangement before R10 implementation. Do not claim the refactor complete until the deployed browser-to-BFF-to-vendor flow is verified.
