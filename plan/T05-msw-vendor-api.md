# T05 – MSW Mock Vendor API

**Objective:** Simulate the third-party quote API in the browser with validated, testable behavior.

## Tasks
- Install/configure MSW and implement `POST /api/commission-quotes`.
- Validate `api-key`: missing = 401, invalid = 403, valid = continue.
- Validate positive loan amount, positive integer term, and risk band LOW/MEDIUM/HIGH; invalid payload = 400.
- Generate a unique quote ID, calculate the commission, and return the contract response.
- Add configurable response delay and random failure (default failure rate 0.2, delay 1000 ms); simulated vendor failure = 503.
- Provide deterministic failure controls for tests.

## Tests
Cover valid/missing/invalid keys, invalid amount/term/risk band, successful response shape, unique quote generation, commission calculation, and deterministic simulated failure.

## Acceptance criteria
- Mock implements the agreed contract and authentication/validation/failure behavior; relevant tests pass.

## Dependencies
- T04.
