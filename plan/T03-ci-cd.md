# T03 – CI/CD Baseline

**Objective:** Prove automated validation and deployment on the initial application before feature development. This is a hard gate: complete and verify T03 before T04.

## CI workflow
Create `.github/workflows/ci.yml`, triggered by pull requests targeting `main` and pushes to `main`. Run checkout, Node.js LTS setup, `npm ci`, lint, typecheck, unit tests, and production build. Fail the workflow if any check fails.

## Deployment workflow
Create `.github/workflows/deploy.yml` to deploy to GitHub Pages only after successful CI on `main`. Configure Vite's base path, minimal Actions permissions, and production artifact upload. Use GitHub Actions as the Pages source.

## GitHub configuration and documentation
- Configure Pages and Actions permissions; protect `main` with required checks where available.
- Document the deployment process.

## Acceptance criteria
- CI runs automatically and all checks pass on the initial app; failures block the workflow and PRs receive status.
- The deployment workflow succeeds and the public Pages URL loads the initial app.

## Dependencies
- T02. Do not start T04 until this task is verified.
