# Loan Commission Quote Demo

A React and TypeScript demo for capturing loan details and requesting a commission quote from a simulated vendor API. The project uses Vite, MSW, Vitest, React Testing Library, and Playwright.

## Project status

The implementation plan is in [`plan/`](plan/). Work is organized into tasks T01–T11 and follows the stage gates documented there.

## API contract

The simulated endpoint is `POST /api/commission-quotes`. It accepts a loan amount, term in months, and risk band (`LOW`, `MEDIUM`, or `HIGH`) and returns a quote ID, commission rate, and total commission. The illustrative rates are 1.5%, 2.0%, and 2.5%, respectively.

## Security note

MSW runs in the browser, so its API-key validation is only a simulation and is not production-grade security. Do not put real vendor credentials in this application. A real integration must keep credentials in a trusted backend.