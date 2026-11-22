# R05: BFF-to-Vendor HTTP Client

**Goal:** Provide the server-side HTTP boundary from BFF to vendor simulator.

## Tasks

- Implement a reusable client in `apps/bff` using Node fetch or a small HTTP library already justified by the project.
- Configure vendor base URL and API key only from server environment variables.
- Serialize/validate vendor requests and parse/validate vendor responses with shared Zod schemas.
- Add configurable request timeout and normalize network, timeout, auth, invalid-response, and vendor HTTP errors.

## Tests

- Unit-test URL, method, headers, payload, response mapping, timeout, network failures, and status-code mapping with a stubbed fetch.
- Integration-test against the local Fastify vendor process for success and representative failures.

## Acceptance criteria

- No vendor key or direct vendor URL is present in web bundles.
- BFF has a single tested server-side client boundary to the vendor.
