# Refactor Task Index

Read the root [`plan.md`](../../plan.md) for the architecture overview, migration map, constraints, and deployment decision gate. The task IDs normalize the source request's duplicate/malformed labels into R01-R10.

## Order and dependencies

| Order | Task | Depends on | Completion gate |
|---|---|---|---|
| 1 | [R01 Monorepo](R01-monorepo.md) | T01-T11 baseline | Existing web behavior/tests survive workspace conversion. |
| 2 | [R02 Contracts](R02-contracts.md) | R01 | Zod schemas/types and contract tests pass. |
| 3 | [R04 Vendor](R04-vendor-simulator.md) | R02 | Independent vendor API and its tests pass. |
| 4 | [R05 Vendor client](R05-vendor-client.md) | R02, R04 | Server-side HTTP client behavior is tested. |
| 5 | [R03 BFF](R03-bff.md) | R02, R05 | Frontend-facing routes and vendor mapping tests pass. |
| 6 | [R06 Frontend](R06-frontend.md) | R03, T07-T09 | Existing UI calls BFF only; no browser vendor key/MSW runtime. |
| 7 | [R07 Errors](R07-error-handling.md) | R03-R06 | Error, timeout, retry, and stale-state tests pass. |
| 8 | [R08 E2E](R08-e2e.md) | R04-R07 | Complete deterministic Chromium journeys pass. |
| 9 | [R09 CI/CD](R09-ci.md) | R01-R08 | CI validates all workspaces/E2E and gates deployment. |
| 10 | [R10 Deployment](R10-deployment.md) | R09 plus hosting decision | Public end-to-end demo and server-side secret configuration verified. |

Although task IDs preserve the requested requirement labels, execution order puts vendor/client before BFF because the BFF depends on a working upstream service.

## Per-task development gate

For each implementation task: inspect the owning code; implement the narrow change; add success, failure, and relevant edge-case tests in the same task; run focused tests, typecheck, and lint; then run the relevant workspace checks before marking complete. Keep unaffected existing tests and update only those whose boundary intentionally changes.
