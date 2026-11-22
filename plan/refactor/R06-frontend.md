# R06: Frontend Migration to BFF

**Goal:** Preserve the existing UI while changing its network destination from browser MSW/vendor simulation to BFF.

## Tasks

- Move/reuse the existing web app under `apps/web` from R01.
- Update the API client to call the BFF base URL using the existing frontend request/response contract where feasible.
- Remove API key values and vendor settings from all frontend configs; configure only a public BFF URL.
- Remove MSW startup from the browser and stop bundling `mockServiceWorker.js` after BFF integration is verified.
- Keep React components and hooks dependent on frontend-owned models; map wire shapes at the API boundary.
- Preserve the existing form, accessible loading component, validation, retry, quote result, and responsive styling.

## Tests

- Update API client tests for BFF URL, request, parsing, and errors.
- Keep component tests independent of HTTP details by mocking the API client/hook.
- Add a check that production web output contains no vendor API key or vendor base URL.

## Acceptance criteria

- Browser communicates only with BFF.
- Browser bundles contain no vendor credential and do not start a vendor simulator.
- Existing frontend behavior and tests remain intact.
