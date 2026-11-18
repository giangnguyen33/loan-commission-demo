# Loan Commission Quote Demo – Development Plan

## 1. Objective

Build a React + TypeScript web application that integrates with a simulated third-party Commission Quote API.

The application must demonstrate:
- Loan details capture.
- Commission quote generation.
- Third-party API contract compliance.
- API-key authentication behaviour.
- Random vendor API failures.
- Loading and error handling.
- Unit and E2E testing.
- GitHub source control.
- GitHub Actions CI/CD.
- Local development and public demo deployment.

**Time budget:** 2–4 hours.

## 2. Technology stack

| Area | Technology |
|---|---|
| Frontend | React |
| Language | TypeScript |
| Build tool | Vite |
| API mocking | MSW |
| Unit testing | Vitest |
| Component testing | React Testing Library |
| E2E testing | Playwright |
| Package manager | npm |
| Source control | GitHub |
| CI/CD | GitHub Actions |
| Hosting | GitHub Pages |

## 3. Architecture

```text
Developer
   |
   v
GitHub Repository
   |
   v
GitHub Actions
   |
   +-- Lint
   +-- Type Check
   +-- Unit Tests
   +-- Build
   +-- E2E Tests (added in T10)
   |
   v
GitHub Pages Deployment

React Application
   |
   v
Commission Quote API Client
   |
   v
MSW Mock Vendor API
   |
   +-- API Key Validation
   +-- Request Validation
   +-- Quote Generation
   +-- Random Failure Simulation
```

MSW runs in the browser and simulates the vendor API. No real backend is required for this demo.

---

# 4. Implementation tasks

## T01 – GitHub repository setup

**Objective:** Create and initialise the project repository.

Tasks:
- Create GitHub repository `loan-commission-demo`.
- Set `main` as default branch.
- Clone repository locally.
- Add README.md.
- Add .gitignore.
- Configure Git identity and remote.
- Create initial commit.
- Push initial code to GitHub.

Acceptance criteria:
- GitHub repository exists.
- Local project is connected to GitHub.
- Initial commit is pushed successfully.

## T02 – React + TypeScript project setup

**Objective:** Establish the development foundation.

Tasks:
- Initialise React + TypeScript + Vite.
- Install dependencies.
- Configure TypeScript.
- Configure ESLint.
- Configure npm scripts.
- Create initial application structure.
- Configure basic application rendering.
- Add a basic application rendering test.

Acceptance criteria:
- `npm install` succeeds.
- `npm run dev` starts the application.
- `npm run build` succeeds.
- TypeScript validation passes.
- ESLint passes.
- Initial unit test passes.

## T03 – CI/CD setup

**Objective:** Establish automated validation and deployment before implementing application features.

This task must be completed and verified before T04.

### T03.1 – CI workflow

Create:

`.github/workflows/ci.yml`

Trigger:
- Pull requests targeting main.
- Pushes to main.

Initial pipeline:
1. Checkout repository.
2. Setup Node.js LTS.
3. Install dependencies using `npm ci`.
4. Run ESLint.
5. Run TypeScript validation.
6. Run unit tests.
7. Build production application.

Acceptance criteria:
- Workflow runs automatically.
- All checks pass on the initial application.
- Failed checks cause workflow failure.
- Pull requests receive CI status.

### T03.2 – CD workflow

Create:

`.github/workflows/deploy.yml`

Requirements:
- Deploy to GitHub Pages.
- Deploy only after successful CI on main.
- Use GitHub Actions as the GitHub Pages deployment source.
- Configure Vite base path correctly.
- Upload production build artifacts.
- Configure minimum required GitHub Actions permissions.

Acceptance criteria:
- Deployment workflow executes successfully.
- Public GitHub Pages URL is accessible.
- Initial application loads correctly.

### T03.3 – GitHub configuration

- Configure GitHub Pages.
- Configure GitHub Actions permissions.
- Protect main with required CI checks where available.
- Document deployment process.

Important:
The initial pipeline must work before application features are implemented.

Future development tasks must extend the existing pipeline rather than recreate it.

---

## T04 – API contract and TypeScript models

**Objective:** Define the agreed third-party API contract.

Endpoint:

`POST /api/commission-quotes`

Request headers:

```http
Content-Type: application/json
api-key: demo-vendor-key
```

Request:

```json
{
  "loanAmount": 500000,
  "loanTermInMonths": 360,
  "riskBand": "LOW"
}
```

Response:

```json
{
  "quoteId": "CQ-123456",
  "commissionRate": 0.015,
  "totalCommission": 7500
}
```

Risk bands:
- LOW: 1.5%.
- MEDIUM: 2.0%.
- HIGH: 2.5%.

These are illustrative demo rates.

Tasks:
- Define TypeScript request interface.
- Define TypeScript response interface.
- Define RiskBand type.
- Define API error model.
- Document the contract.

Unit tests:
- Verify valid contract examples.
- Verify supported risk band values.
- Verify commission calculation.

Acceptance criteria:
- API contracts are strongly typed.
- TypeScript validation passes.
- Corresponding tests pass.

## T05 – MSW mock vendor API

**Objective:** Simulate the third-party Commission Quote API.

Tasks:
- Install and configure MSW.
- Create POST handler.
- Validate API-key header.
- Validate request payload.
- Generate unique quote ID.
- Calculate commission.
- Return correct response.
- Simulate random failures.
- Configure response delay.

Authentication behaviour:

| Condition | HTTP status |
|---|---|
| Missing API key | 401 |
| Invalid API key | 403 |
| Valid API key | Continue |

Request validation:
- Loan amount must be positive.
- Loan term must be a positive integer.
- Risk band must be LOW, MEDIUM or HIGH.

Invalid payload returns HTTP 400.

Random failure configuration:

```typescript
{
  failureRate: 0.2,
  responseDelayMs: 1000
}
```

Simulated vendor failure returns HTTP 503.

Unit tests:
- Valid API key.
- Missing API key.
- Invalid API key.
- Invalid loan amount.
- Invalid loan term.
- Invalid risk band.
- Successful quote generation.
- Correct commission calculation.
- Simulated failure.
- Response structure.

Use deterministic failure controls for tests.

Acceptance criteria:
- Mock API implements the agreed contract.
- Authentication behaviour works.
- Random failure simulation works.
- All relevant tests pass.

## T06 – Commission Quote API client

**Objective:** Implement a reusable frontend API client.

Tasks:
- Create `commissionQuoteApi.ts`.
- Implement POST request.
- Include api-key header.
- Serialize request.
- Parse response.
- Handle HTTP errors.
- Handle network errors.
- Return typed response.

Unit tests:
- Correct endpoint.
- Correct HTTP method.
- Correct request payload.
- API-key header included.
- Successful response parsed.
- HTTP 400 handling.
- HTTP 401 handling.
- HTTP 403 handling.
- HTTP 503 handling.
- Network error handling.

Acceptance criteria:
- React components do not implement fetch logic directly.
- API client is reusable.
- All tests pass.

## T07 – Loan details form

**Objective:** Implement the loan input form.

Fields:
- Loan amount.
- Loan term in months.
- Risk band dropdown.

Tasks:
- Build React form.
- Add form validation.
- Add Generate Quote button.
- Integrate with API client.
- Prevent duplicate submissions.

Unit/component tests:
- Form renders.
- Fields accept input.
- Risk band selection works.
- Required validation works.
- Invalid loan amount rejected.
- Invalid loan term rejected.
- Submission invokes API client.
- Duplicate submissions prevented.

Acceptance criteria:
- Form works correctly.
- All relevant tests pass.

## T08 – Quote result display

**Objective:** Display successful quote responses.

Tasks:
- Create QuoteResult component.
- Display quote ID.
- Display commission rate.
- Display total commission.
- Format monetary amounts as AUD.

Unit/component tests:
- Quote ID displayed.
- Commission rate displayed.
- Total commission displayed.
- AUD currency formatting correct.
- Component handles expected response data.

Acceptance criteria:
- Successful quote details are displayed correctly.
- All tests pass.

## T09 – Loading, error handling and retry

**Objective:** Provide a complete user experience for API failures.

Tasks:
- Implement loading state.
- Disable Generate Quote during requests.
- Display validation errors.
- Display authentication errors.
- Display vendor errors.
- Display network errors.
- Allow retry after failure.
- Clear previous errors appropriately.

Unit/component tests:
- Loading indicator displayed.
- Button disabled during request.
- HTTP 503 message displayed.
- Authentication error displayed.
- Network error displayed.
- Retry works after failure.
- Successful retry displays quote.

Acceptance criteria:
- All error states work.
- User can retry.
- All tests pass.

---

## T10 – End-to-end testing

**Objective:** Test complete user journeys using Playwright.

E2E tests:
1. Open loan application.
2. Submit valid loan details.
3. Generate quote successfully.
4. Verify quote information.
5. Validate invalid loan amount.
6. Validate invalid loan term.
7. Verify LOW, MEDIUM and HIGH risk bands.
8. Verify loading state.
9. Simulate HTTP 503.
10. Verify error message.
11. Retry after failure.

Requirements:
- Use deterministic MSW scenarios.
- Do not depend on random failure probability.
- Run tests in Chromium.
- Save test reports and traces on failure.

Update GitHub Actions CI workflow to include:
- Playwright browser installation.
- E2E test execution.
- Test report upload.

Acceptance criteria:
- E2E tests pass locally.
- E2E tests pass in GitHub Actions.
- Failures prevent deployment.

## T11 – Final verification

Tasks:
- Verify local application.
- Run all unit tests.
- Run all E2E tests.
- Run ESLint.
- Run TypeScript validation.
- Verify production build.
- Verify GitHub Actions.
- Verify GitHub Pages deployment.
- Verify deployed MSW API.
- Update README with demo URL.

Acceptance criteria:
- Local application works.
- All automated tests pass.
- CI pipeline passes.
- Public demo URL works.
- Documentation is complete.

---

# 5. Mandatory development and testing policy

Unit tests MUST be implemented alongside every development task.

Do not create a separate phase for implementing all unit tests after application development.

Every development task must follow:

1. Implement feature.
2. Write corresponding unit/component tests.
3. Cover successful behaviour.
4. Cover failure scenarios.
5. Cover relevant edge cases.
6. Run tests.
7. Run TypeScript validation.
8. Run ESLint.
9. Fix failures.
10. Mark task complete.

A task is not complete until its implementation and corresponding tests pass.

E2E testing is a dedicated task because it validates complete user journeys across the application.

# 6. CI/CD quality gates

The final CI pipeline must run:

1. npm ci
2. npm run lint
3. npm run typecheck
4. npm run test:unit
5. npm run build
6. npm run test:e2e

Deployment must only occur after all required checks pass on main.

# 7. Suggested project structure

```text
loan-commission-demo/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── public/
│   └── mockServiceWorker.js
├── src/
│   ├── api/
│   │   ├── commissionQuoteApi.ts
│   │   └── commissionQuoteApi.test.ts
│   ├── components/
│   │   ├── LoanQuoteForm.tsx
│   │   ├── LoanQuoteForm.test.tsx
│   │   ├── QuoteResult.tsx
│   │   └── QuoteResult.test.tsx
│   ├── mocks/
│   │   ├── browser.ts
│   │   ├── handlers.ts
│   │   └── handlers.test.ts
│   ├── types/
│   │   └── commissionQuote.ts
│   ├── test/
│   │   └── setup.ts
│   ├── App.tsx
│   └── main.tsx
├── e2e/
│   └── commission-quote.spec.ts
├── AGENTS.md
├── README.md
├── package.json
├── vite.config.ts
├── vitest.config.ts
└── playwright.config.ts
```

# 8. Time budget

| Task | Estimated time |
|---|---:|
| T01 Repository setup | 10 min |
| T02 React setup | 15 min |
| T03 CI/CD setup | 30 min |
| T04 API contracts + tests | 10 min |
| T05 MSW + tests | 30 min |
| T06 API client + tests | 15 min |
| T07 Loan form + tests | 25 min |
| T08 Quote display + tests | 15 min |
| T09 Error handling + tests | 20 min |
| T10 E2E testing | 25 min |
| T11 Final verification | 15 min |
| **Total** | **3 hours 30 minutes** |

# 9. Scope constraints

- No backend implementation.
- No database.
- No AWS infrastructure.
- No unnecessary dependencies.
- No additional business features.
- Keep implementation simple.
- Reuse existing project conventions.
- Keep API contracts separate from UI components.
- Keep MSW handlers separate from application logic.
- Do not expose real API keys.
- Do not skip unit tests.

Security limitation: MSW runs in the browser. Its API-key validation is a simulation and does not provide production-grade server-side security. Real vendor credentials must be held by a trusted backend.

# 10. Coding agent execution instructions

Work strictly in task order.

### Stage 1
Complete T01 and T02.

Report repository and project setup results.

### Stage 2
Complete T03.

Verify CI and deployment with the initial application before continuing.

### Stage 3
Implement T04 through T09 incrementally.

For every development task:
- Implement feature.
- Implement unit tests.
- Run tests.
- Run lint and type checking.
- Update task status.
- Commit completed work.

### Stage 4
Complete T10 and T11.

Verify the full application locally and on GitHub Pages.

Do not skip phases or begin application implementation before T03 is verified.

Do not claim completion without evidence from actual test runs and deployment verification.