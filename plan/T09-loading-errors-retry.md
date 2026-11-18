# T09 – Loading, Errors, and Retry

**Objective:** Make quote submission states and recoverable failures clear to the user.

## Tasks
- Show loading state and disable Generate Quote while a request is active.
- Display validation, authentication, vendor, and network errors.
- Allow retry after failure and clear stale errors appropriately.

## Component tests
Cover loading display, disabled submit button, HTTP 503, authentication and network errors, retry, and successful quote after retry.

## Acceptance criteria
- Error states are handled and retry works; all relevant tests pass.

## Dependencies
- T08.
