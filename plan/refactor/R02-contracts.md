# R02: Shared Runtime Contracts

**Goal:** Establish shared frontend-facing and vendor-facing schemas with Zod runtime validation and inferred TypeScript types.

## Tasks

- Create `packages/contracts` with separate frontend/BFF and BFF/vendor request, response, and error schemas.
- Preserve the existing browser-facing `POST /api/commission-quotes` JSON shape where possible; define the vendor endpoint contract independently.
- Infer TypeScript types from Zod schemas; do not duplicate handwritten/generated request and response shapes across apps.
- Standardize error codes/status mapping in shared contracts.
- Decide whether `loanCommission.yaml` remains the published frontend-facing spec; add a generation or drift-check process if it remains.

## Tests

- Accept valid examples and risk bands; reject missing, malformed, out-of-range, and unsupported enum data.
- Test error schema consistency and frontend/vendor contract mapping assumptions.

## Acceptance criteria

- Both servers validate untrusted input at runtime using shared schemas.
- Web and server packages import only the contract types appropriate to their boundary.
- Contract tests and typecheck pass.
