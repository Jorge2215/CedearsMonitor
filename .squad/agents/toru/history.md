# Project Context

- **Owner:** Jorge2215
- **Project:** CedearMonitor — Web App for Financial Information (CEDEAR market data)
- **Stack:** TBD
- **Created:** 2026-05-16

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-05-16: Phase 1 completion — scaffold and orchestration
- Scaffoled full React 18 + Vite project and coordinated contributors. Created App shell and CI/CD workflow. Verified component stubs and service hooks were integrated with tests.
- Outcome: Implementation completed and cross-agent tests passing (30/30).


### 2026-05-16: React + Vite scaffold created
- Built complete React 18 + Vite 5 project scaffold from scratch (no interactive scaffolding).
- **Key file paths:**
  - `src/main.jsx` — entry point
  - `src/App.jsx` — root component (wires up all child components and the useCedearData hook)
  - `src/App.css` — layout styles with CSS custom properties
  - `src/index.css` — global reset and CSS variables
  - `src/data/CedearsList.json` — 120+ CEDEAR tickers (copied from `Data/CedearsList.json`)
  - `src/components/` — TickerDropdown, DateRangePicker, DataTable, PriceChart (stubs for Creta)
  - `src/services/cedearService.js` — API call stub (for Cinnamon)
  - `src/hooks/useCedearData.js` — data-fetching hook stub (for Cinnamon)
  - `vite.config.js` — Vite + Vitest config with dev proxy to data912.com
  - `.github/workflows/azure-static-web-apps.yml` — CI/CD: test → build → deploy
- **Dependencies:** react 18, recharts, react-datepicker, date-fns
- **Dev stack:** Vite 5, Vitest, @testing-library/react, jsdom
- **API:** `https://data912.com/historical/cedears/{ticker}` — no auth, no backend needed
- **Deployment:** Azure Static Web Apps, output in `dist/`, CI/CD via GitHub Actions
- Architecture decision documented in `.squad/decisions/inbox/toru-react-vite-architecture.md`


### 2026-05-16: Azure SWA blank screen � skip_app_build diagnosis and fix
- Key finding: skip_app_build: true with output_location: "dist" does NOT upload from dist/ � it uploads from pp_location (repo root), serving the raw dev index.html.
- Fix: Remove skip_app_build: true and the manual Node.js setup / 
pm ci / 
pm run build steps. Let the Azure SWA Oryx builder auto-detect Node.js/Vite, run 
pm run build, and deploy from output_location: "dist".
- Commit: 6eb7761 pushed to both dev and main, triggering redeployment.
### 2026-05-16T21:50:21.867-03:00: Deployment fix applied (toru)
- Action: Removed `skip_app_build: true` and allowed Oryx to build the Vite app. Commit 6eb7761 was pushed to dev and merged to main.
- Verification: CI/CD redeployment started; live site: https://kind-coast-09b59f110.7.azurestaticapps.net/
- Notes: Coordinator diagnosed root cause (skip_app_build behavior) and monitored run #13.
