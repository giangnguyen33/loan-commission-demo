# R07: Standardized Errors, Timeout, and Retry

**Goal:** Make failures consistent from vendor through BFF to the existing accessible UI.

## Tasks

- Define stable shared error codes, HTTP statuses, and public messages in R02 contracts.
- Ensure BFF maps invalid input, vendor auth/config errors, vendor 503, timeout, network errors, and malformed vendor response to safe frontend errors.
- Preserve the existing form alert, polite loading announcement, focusable submit button, retry, and stale-error clearing.
- Retry only explicitly transient failures and cap attempts; do not automatically retry validation or authentication failures. Keep user-triggered retry available.

## Tests

- Unit-test mappings for invalid input, 401/403, 503, timeout, network, malformed response, and unknown internal error.
- Component-test visible messages, loading/aria-busy behavior, clearing errors on edits, and retry success.
- Assert internal stack traces, vendor URLs, and credentials are not exposed.

## Acceptance criteria

- UI receives one stable error format regardless of vendor failure shape.
- Retry behavior is bounded, documented, and covered by tests.
