# Cedears Monitor

A responsive React app to explore historical CEDEAR prices (Argentine certificates of foreign stocks).

Live demo: https://kind-coast-09b59f110.7.azurestaticapps.net/

Features

- Interactive line charts for price history (Recharts)
- Date range selection and calendar controls (react-datepicker, date-fns)
- Responsive UI with a custom Chakra UI v2 theme (see `src/theme.js`)
- No API key required — historical data fetched from data912.com
- Unit and component tests with Vitest + Testing Library

Tech Stack

- React 18
- Vite 5
- Chakra UI v2 (@chakra-ui/react)
- Emotion (@emotion/react, @emotion/styled)
- Framer Motion
- Recharts
- react-datepicker, date-fns

Getting started

```bash
npm install
npm run dev
npm test
npm run build
```

Project structure (high level)

- src/
  - components/        # React components
  - pages/             # Route pages
  - data/              # Cedear lists and static assets
  - theme.js           # Custom Chakra UI v2 theme (imported from `src/theme.js`)
  - main.jsx           # App bootstrap

Deployment

This project is deployed to Azure Static Web Apps via GitHub Actions (`.github/workflows/azure-static-web-apps.yml`). The pipeline runs in this order:

1. test — installs dependencies and runs `npm test`
2. build — Azure's Oryx build compiles the Vite app (no `skip_app_build`), producing the `dist/` output
3. deploy — Azure Static Web Apps action uploads `dist/` to the static site

The workflow in the repository uses `app_location: "/"` and `output_location: "dist"` and is triggered on pushes to `main` and `dev`, PRs, and manual dispatch.

Notes

- Theme and design tokens are defined in `src/theme.js`.
- The frontend consumes the public API at `https://data912.com/historical/cedears/{ticker}`.
- And wait for the Bird to wind up the world.....

