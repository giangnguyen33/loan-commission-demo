# T10 – End-to-End Testing

**Objective:** Validate complete user journeys in Chromium with Playwright.

## Journeys
- Open the app, submit valid details, generate a quote, and verify quote information.
- Validate invalid loan amount and term.
- Exercise LOW, MEDIUM, and HIGH risk bands.
- Verify loading state.
- Trigger deterministic HTTP 503, verify the error, and retry successfully.

## Tasks
- Add Playwright configuration and E2E specs.
- Use deterministic MSW scenarios; do not rely on random failure probability.
- Save reports and traces on failure.
- Extend CI with browser installation, E2E execution, and test-report upload.

## Acceptance criteria
- E2E tests pass locally and in GitHub Actions; failures prevent deployment.

## Dependencies
- T09.
