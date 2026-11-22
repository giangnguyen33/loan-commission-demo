# R10: Demo Deployment

**Goal:** Deploy and verify the full web -> BFF -> vendor flow with secrets held only by server infrastructure.

## Decision gate

GitHub Pages cannot host Fastify processes. Before implementation, select hosting for BFF and vendor (or a platform that supports both) and decide whether the web remains on Pages with cross-origin BFF access or moves to same-origin routing. Record service URLs, allowed origin, health checks, and cost/availability constraints. The initial proposal is Pages for the static web app with separately hosted BFF/vendor services; prefer a private vendor endpoint reachable only by BFF when the platform supports it.

## Tasks

- Deploy the web app and configure its public BFF base URL.
- Deploy BFF and vendor services with health checks and server-only environment variables.
- Store the vendor API key in the hosting provider's secret manager; never in Git, Vite variables, or browser assets.
- Configure restrictive CORS or same-origin proxy routing.
- Configure production-safe failure settings and disable deterministic test scenario controls.
- Update README with public URL, deployment architecture, required environment settings (names only), and limitations.

## Acceptance criteria

- Public E2E quote generation reaches vendor through BFF.
- Success, validation error, and vendor failure mappings work in the deployed environment.
- Browser bundle inspection confirms no vendor key or private vendor URL is exposed.
- Deployment runs only after all R09 CI gates pass on main.
