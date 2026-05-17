# Cedears Monitor by Jorgito

A responsive web application for analyzing the historical price evolution of CEDEARs — Argentine certificates of foreign stocks.

## Tech Stack

- **React 18** — UI framework
- **Vite 5** — build tool and dev server
- **Recharts** — composable charting library for financial line charts
- **react-datepicker + date-fns** — calendar controls and date utilities
- **Vitest + React Testing Library** — unit and component testing
- **Azure Static Web Apps** — hosting, CDN, and global distribution

## Prerequisites

- [Node.js 20+](https://nodejs.org/) and npm

## Setup

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Testing

```bash
npm test
```

Runs all tests once with Vitest in non-interactive mode.

```bash
npm run test:watch
```

Runs tests in watch mode during development.

## Build

```bash
npm run build
```

Outputs static assets to the `dist/` directory, ready for deployment.

## Deployment — Azure Static Web Apps

1. Create an Azure Static Web App resource in the Azure Portal.
2. Add the deployment token as a GitHub repository secret named `AZURE_STATIC_WEB_APPS_API_TOKEN`.
3. Push to `main` — the CI/CD pipeline will test, build, and deploy automatically.

The deployed app will be available at `https://<appname>.azurestaticapps.net`.

## Branch Strategy

| Branch | Environment |
|--------|------------|
| `main` | Production |
| `dev` | Staging |
| `feature/*` | Development |

**Workflow:** create a `feature/*` branch → open PR into `dev` → merge `dev` into `main` after validation.

**Commit convention:** use prefixes — `feat:`, `fix:`, `docs:`, `chore:`, `test:`.

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/azure-static-web-apps.yml`):

1. **test** — installs dependencies and runs `npm test`
2. **build_and_deploy** — builds and deploys to Azure SWA (only after tests pass)
3. **close_pull_request** — closes staging preview when a PR is closed

Triggers on push to `main` / `dev` and on pull requests targeting those branches.

## API

Historical price data is fetched from:

```
GET https://data912.com/historical/cedears/{ticker}
```

Response format:

```json
[
  { "date": "2024-01-02", "o": 150.5, "h": 153.2, "l": 149.8, "c": 152.1 },
  ...
]
```

No `.env` file or API key is required — this is a public endpoint consumed directly from the frontend.

## CEDEAR List

The list of available tickers is loaded from `src/data/CedearsList.json`. Each entry has:

```json
{ "Ticket": "MSFT", "Company": "Microsoft Corp." }
```
