# R03: Fastify BFF

**Goal:** Implement the frontend-facing Fastify service that validates requests, calls the vendor client, and returns a stable frontend response.

## Tasks

- Add a Fastify app in `apps/bff` with `GET /health` and `POST /api/commission-quotes`.
- Validate the existing frontend request with the shared Zod contract.
- Call the R05 vendor client over HTTP; map vendor data to the existing frontend response model/contract.
- Map validation, authentication/configuration, vendor 503, timeout, and network failures to consistent frontend error responses.
- Configure server-only environment variables and CORS/origin policy for the selected topology.

## Tests

- Unit-test route validation, successful mapping, and each error mapping.
- Integration-test Fastify routes with the vendor client stubbed; assert status and response schemas.
- Verify `GET /health` and readiness behavior.

## Acceptance criteria

- The browser-facing route contract remains compatible where feasible.
- BFF has no browser code and never returns vendor credentials.
- BFF communicates with vendor only through the R05 HTTP client.
