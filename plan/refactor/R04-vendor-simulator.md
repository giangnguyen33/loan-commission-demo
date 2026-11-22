# R04: Independent Vendor Simulator

**Goal:** Move the current MSW vendor behavior into an independently running Fastify process.

## Tasks

- Add `apps/vendor` with `POST /vendor/commission-quotes` and a health route.
- Validate the vendor-facing request using shared Zod schemas.
- Validate server-side API key: missing = 401, invalid = 403.
- Reuse the frontend-owned commission-rate/domain logic where possible; generate unique quote IDs and return vendor contract responses.
- Support configurable response delay and failure rate with defaults matching the demo (1 second and 20%).
- Provide deterministic success/failure controls for tests only; ensure these controls cannot be activated publicly in production.

## Tests

- Unit-test validation, authentication, rate/total calculation, ID format/uniqueness, delay/failure configuration.
- Fastify integration-test success, missing/invalid keys, invalid payloads, and deterministic 503.

## Acceptance criteria

- Vendor runs as a standalone server process and is reachable over HTTP from BFF.
- No MSW runtime is required to exercise the server API.
- Existing MSW tests remain until R06 migration; remove obsolete browser simulation only after equivalent vendor tests pass.
