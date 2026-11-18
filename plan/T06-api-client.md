# T06 – Commission Quote API Client

**Objective:** Provide a reusable typed client so UI components do not implement fetch logic.

## Tasks
- Create `src/api/commissionQuoteApi.ts`.
- POST the typed request to the agreed endpoint with the API-key header.
- Serialize the request, parse the typed response, and handle HTTP and network errors.

## Tests
Verify endpoint, method, payload, API-key header, successful parsing, HTTP 400/401/403/503 handling, and network errors.

## Acceptance criteria
- Client is reusable, components remain free of direct fetch logic, and all client tests pass.

## Dependencies
- T05.
