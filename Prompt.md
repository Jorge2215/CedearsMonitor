# Cedears Monitor - Prompt

## Role
Act as a senior full-stack web developer specialized in React and modern cloud deployment practices, with deep experience in financial applications development.

## Context
We need to build a responsive web application that allows users to analyze the historical price evolution of CEDEARs (Argentinian certificates of foreign stocks).  
The App Name must be **"Cedears Monitor"**.

## Objective
Create a dynamic web application that enables users to:
- Select a CEDEAR ticker from a predefined list.
- Retrieve its historical price data from an external API.
- Display the data in both tabular and graphical formats.

## Functional Requirements

### 1. User Interface
- Provide a dropdown list populated from `CedearsList.json` (fields: "Ticket", "Company").
- Include a "Consultar" button to trigger data retrieval.
- Default time frame: current year. Allow custom time frame selection via calendar controls.
- Display results in:
  - A **Grid/Table** with columns: Date, Open, High, Low, Close.
  - A **Line Chart** showing price evolution over the selected period.
- UI must be responsive, modern, and clean, using light colors.

### 2. Data Retrieval
- Use REST API endpoint:  
  `https://data912.com/historical/cedears/{ticker}`
- Replace `{ticker}` with the selected value (e.g., MSFT).
- API returns JSON with historical price data.
- Cedears list must be loaded from `CedearsList.json` located in `/src/data`.

### 3. Data Structure (API Response Example)
Each record contains:
- `date`: string (YYYY-MM-DD)
- `o`: opening price
- `h`: highest price
- `l`: lowest price
- `c`: closing price

### 4. Technical Requirements
- Frontend: React + modern charting library (e.g., Chart.js, Recharts).
- Backend: Node.js or serverless functions (if needed for proxy/auth).
- Deployment: Azure Static Web Apps.
- Code must be modular, documented, and production-ready.
- Use English labels consistently (`Ticket`, `Company`).

## Deliverables
- Source code in GitHub repository.
- Clear README with setup and deployment instructions.
- Working demo deployed in Azure (`https://<appname>.azurestaticapps.net`).
- Automated tests included in CI/CD pipeline.

## Repository & Branching Strategy
- Repository: [https://github.com/Jorge2215/CedearsMonitor](https://github.com/Jorge2215/CedearsMonitor)
- `.gitignore`: React + .NET 10 solution.
- Branches:
  - `main`: production-ready code.
  - `dev`: integration branch.
- Workflow:
  - Features in `feature/*` branches (e.g., `feature/historical-chart`).
  - Pull Requests into `dev`, then merge into `main` after validation.
- CI/CD:
  - GitHub Actions deploys `main` to Azure Static Web Apps.
  - `dev` deploys to staging.
  - Automated tests must run before deployment.
- Commit convention: use prefixes (`feat:`, `fix:`, `docs:`).
