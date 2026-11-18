# T04 – API Contract and TypeScript Models

**Objective:** Define and test the Commission Quote API contract.

## Contract
- Endpoint: `POST /api/commission-quotes`
- Headers: `Content-Type: application/json`, `api-key: demo-vendor-key`
- Request: `{ "loanAmount": 500000, "loanTermInMonths": 360, "riskBand": "LOW" }`
- Response: `{ "quoteId": "CQ-123456", "commissionRate": 0.015, "totalCommission": 7500 }`
- Rates: LOW 1.5%, MEDIUM 2.0%, HIGH 2.5% (illustrative demo rates).

## Tasks and tests
- Define typed request and response interfaces, `RiskBand`, and an API error model.
- Document the contract.
- Test valid examples, supported risk bands, and commission calculation.

## Acceptance criteria
- Contracts are strongly typed; typecheck and all related tests pass.

## Dependencies
- T03 CI/CD baseline verified.
