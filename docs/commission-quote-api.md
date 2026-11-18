# Commission Quote API Contract

This contract is for the browser-based vendor API simulation used by the demo.

## Endpoint and authentication

`POST /api/commission-quotes`

Headers:

```http
Content-Type: application/json
api-key: demo-vendor-key
```

The API key is a demo value only. MSW runs in the browser, so this check does not provide production-grade security. Never place real vendor credentials in frontend code.

API settings are separated into `src/apiConfig.local.ts` and `src/apiConfig.production.ts`, with `src/apiConfig.ts` selecting the active settings. Vite selects the production config for production builds. Both currently use the same simulated endpoint and demo key because the project has no real backend.

## Request

```json
{
  "loanAmount": 500000,
  "loanTermInMonths": 360,
  "riskBand": "LOW"
}
```

`loanAmount` must be positive, `loanTermInMonths` must be a positive integer, and `riskBand` must be `LOW`, `MEDIUM`, or `HIGH`.

## Successful response

```json
{
  "quoteId": "CQ-123456",
  "commissionRate": 0.015,
  "totalCommission": 7500
}
```

The illustrative commission rates are:

| Risk band | Rate |
|---|---:|
| LOW | 1.5% |
| MEDIUM | 2.0% |
| HIGH | 2.5% |

`totalCommission` is the loan amount multiplied by the applicable rate and rounded to two decimal places.

## Error response

```json
{
  "error": "INVALID_REQUEST",
  "message": "Loan amount must be positive."
}
```

The `error` field is a machine-readable code; `message` is a human-readable description. Expected status codes for authentication and request validation are documented with the mock API task.
