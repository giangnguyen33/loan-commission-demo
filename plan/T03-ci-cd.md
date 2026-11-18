# T03 – CI/CD Baseline

**Objective:** Prove automated validation and deployment on the initial application before feature development. This is a hard gate: complete and verify T03 before T04.

## CI workflow
Create `.github/workflows/ci.yml`, triggered by pushes to `main`, pushes to feature branches, and pull requests targeting `main`. Run checkout, Node.js LTS setup, `npm ci`, lint, typecheck, unit tests, and production build. Fail the workflow if any check fails. Feature branches run these same CI checks but never deploy.

## Deployment workflow
Create `.github/workflows/deploy.yml` to deploy to GitHub Pages only after successful CI on `main`. Never deploy feature branches or pull requests. Configure Vite's base path, minimal Actions permissions, and production artifact upload. Use GitHub Actions as the Pages source.

## GitHub configuration and documentation
- Keep `main` as the protected integration branch; merge changes through pull requests rather than pushing feature work directly to it.
- Require all CI checks to pass before a pull request can merge into `main`; failed or pending checks block merging.
- Configure Pages and Actions permissions; document the deployment process.

## Acceptance criteria
- Feature-branch pushes and pull requests run lint, typecheck, unit tests, and production build; any failure blocks merging into `main`.
- Feature branches and pull requests do not deploy; only a successful CI run on `main` can trigger deployment.
- The deployment workflow succeeds and the public Pages URL loads the initial app.

## Dependencies
- T02. Do not start T04 until this task is verified.
