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
