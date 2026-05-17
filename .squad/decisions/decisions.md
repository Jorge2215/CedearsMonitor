# Project Decisions — CedearMonitor

This file consolidates decisions submitted to `.squad/decisions/inbox/` (merged 2026-05-16).

---

## cinnamon-data-layer.md

# Decision: Data Layer Architecture

**Author:** Cinnamon  
**Date:** 2026-05-16  
**Status:** Proposed

### Context

CedearMonitor is a frontend-only React + Vite app deployed to Azure Static Web Apps. It needs to retrieve historical OHLC price data for CEDEAR tickers from `https://data912.com`.

### Decisions

1. Direct browser-to-API (no proxy)

Requests are made directly from the browser using the native `fetch` API. No backend proxy or serverless function is used. This keeps deployment simple (static assets only) and removes a network hop.

Trade-off: The external API must allow cross-origin requests (CORS). If `data912.com` restricts origins in the future, a proxy will need to be introduced.

2. Client-side date filtering

The `https://data912.com/historical/cedears/{ticker}` endpoint returns the full historical record. Filtering by `dateFrom`/`dateTo` is done in the hook after the API response arrives.

Rationale: The API offers no server-side date range parameters. Fetching all data and filtering locally is the only option. For typical CEDEAR history volumes this is acceptable; if payloads grow significantly, caching or a proxy with server-side slicing should be reconsidered.

Implementation detail: Date strings (`YYYY-MM-DD`) from the API are parsed and normalized to local-timezone midnight via `new Date(year, month, day)` to avoid UTC offset issues. Comparison is inclusive on both ends.

Error propagation strategy

- Input validation happens at the service boundary (`fetchHistoricalData`). An empty or non-string ticker throws before any network call.
- Network errors (fetch rejects) are caught and re-thrown with a message that includes the ticker, preserving the original error message.
- HTTP errors (non-2xx responses) throw with status code and status text.
- Hook error state is a plain string (`err.message`). The hook clears `error` at the start of every new fetch, so a successful retry always surfaces clean state to the UI.

---

## creta-component-interfaces.md

# Component Prop Interfaces — CedearMonitor UI

> Authored by Creta · 2026-05-16

### TickerDropdown

File: `src/components/TickerDropdown.jsx`

Props:
- `value` (string) — Currently selected ticker. Empty string means nothing selected.
- `onChange` ((ticker: string) => void) — Called with the raw ticker string when the user picks an option.

Renders: a `<select>` populated from `CedearsList.json`, sorted alphabetically by `Company`. Option label format: `{Company} ({Ticket})`.

### DateRangePicker

File: `src/components/DateRangePicker.jsx`

Props:
- `dateFrom` (Date), `dateTo` (Date), `onDateFromChange`, `onDateToChange`.

Constraints: "To" date cannot be before "From". "To" date cannot exceed today. Display format: dd/MM/yyyy.

### DataTable

File: `src/components/DataTable.jsx`

Props: `data` — array of OHLC records from `useCedearData`. May be empty.

Record shape:
```
{
  date: string   // "YYYY-MM-DD"
  o: number | null
  h: number | null
  l: number | null
  c: number | null
}
```

Behaviour:
- Empty or null `data` → renders "No data available for the selected period."  
- Null/undefined prices → rendered as `—`  
- Sorted ascending by date (oldest first)  
- Shows `Showing {n} records` count above the table

### PriceChart

File: `src/components/PriceChart.jsx`

Props: `data` (array), `ticker` (string)

Behaviour:
- Records with null `c` are filtered out before rendering.
- Empty filtered data → renders "No chart data available."
- Tooltip shows Date, Close (bold), Open, High, Low.
- Chart line: Close price (`c`), color `#2563eb`.

---

## may-test-strategy.md

# May — Test Strategy Decision

**Date:** 2026-05-16  
**Author:** May (Tester / QA)  
**Status:** Active

Summary: Establishes the test strategy for CedearMonitor: a React 18 + Vite 5 app. Testing uses Vitest + React Testing Library + jsdom.

Coverage Areas and test mapping are recorded (service, hook, component, integration). Financial edge cases documented: zero prices, null prices, empty array, date boundary inclusivity, stale/missing dates. Environment constraints (ResizeObserver mock, JSON module mocking, async hooks patterns) included.

---

## toru-react-vite-architecture.md

### 2026-05-16: Architecture Decision — CedearMonitor Tech Stack
**By:** Toru (Lead)

What:
- Framework: React 18 + Vite 5
- Charting: Recharts
- Testing: Vitest + React Testing Library + jsdom
- Date handling: react-datepicker + date-fns
- API: Direct REST call to https://data912.com/historical/cedears/{ticker}
- State management: React hooks only
- Deployment: Azure Static Web Apps

Why: Minimal stack, production-ready; Azure SWA handles CDN and global distribution.

---

*Inbox files merged and removed from `.squad/decisions/inbox/`.*
