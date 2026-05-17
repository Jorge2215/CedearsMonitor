# Project Context

- **Owner:** Jorge2215
- **Project:** CedearMonitor — Web App for Financial Information (CEDEAR market data)
- **Stack:** TBD
- **Created:** 2026-05-16

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-05-16: Phase 1 testing completion
- Authored comprehensive test suite (30 tests) across service, hook, components, and integration. Tests cover financial edge cases and environment constraints.
- Outcome: All tests passing (30/30), enabling safe iteration in subsequent phases.


### 2026-05-16 — Chakra UI Migration: Test Infrastructure & Fixes

**Context:** Creta completed full Chakra UI v2 overhaul (App, DataTable, PriceChart, TickerDropdown, main.jsx).

**Failures found (2/30):**
1. `DataTable > renders table headers` — headers renamed to Spanish: Fecha/Apertura/Máximo/Mínimo/Cierre
2. `PriceChart > shows ticker name` — ticker title moved to App.jsx; PriceChart no longer renders it

**Fixes applied:**
- `DataTable.test.jsx`: Updated header assertions to match Spanish column names
- `PriceChart.test.jsx`: Replaced ticker-name test with "chart renders data (no 'no data' text)" assertion
- `src/test-utils.jsx`: Created ChakraProvider + custom theme wrapper (`renderWithChakra`) for future theme-aware tests
- `vite.config.js`: Added `server.deps.inline` for framer-motion and Chakra ESM packages

**Key finding:** Chakra UI components render correctly in jsdom WITHOUT ChakraProvider (they use internal defaults). The 28/30 pre-fix passing tests confirmed this. The ChakraProvider wrapper in test-utils.jsx is provided for future theme-specific assertions.

**Outcome:** 30/30 tests passing. Pushed to origin/dev.


**Stack confirmed:** React 18 + Vite 5, Vitest + React Testing Library + jsdom, Recharts, fetch-based API client.

**Test layer coverage:**
- `src/services/__tests__/cedearService.test.js` — unit tests for the data fetching layer (`fetchHistoricalData`). Covers: happy path, HTTP 4xx/5xx errors, network failures, empty array response, and financial edge cases (zero and null OHLC values).
- `src/hooks/__tests__/useCedearData.test.js` — unit tests for the `useCedearData` hook. Covers: initial empty state, loading flag lifecycle, client-side date-range filtering, error state on failure, and error clearance on subsequent success.
- `src/components/__tests__/TickerDropdown.test.jsx` — component tests for the ticker selector. Covers: render, full list display, placeholder/empty option, onChange callback, and controlled value reflection.
- `src/components/__tests__/DataTable.test.jsx` — component tests for the OHLC table. Covers: headers, row count, date display, empty data, null/zero values, and 365-row stress render.
- `src/components/__tests__/PriceChart.test.jsx` — component tests for the Recharts chart. Covers: no-crash render, ticker label visibility, empty data, null ticker. ResizeObserver mocked for jsdom.
- `src/components/__tests__/App.test.jsx` — integration tests for App composition. Covers: title render, Consultar button presence, disabled-before-selection, enabled-after-selection, no results before first query.

**Key financial edge cases identified:**
- Zero prices (o/h/l/c = 0) — valid in some market halt scenarios; must not be filtered out.
- Null prices — API may return null for fields on days with missing data; components must not crash.
- Empty array response — valid for tickers with no history in the selected range.
- Date range filtering is client-side; timezone-naive `new Date(date)` comparison is the assumed approach (UTC midnight).

**Environment notes:**
- jsdom requires `ResizeObserver` mocked for any Recharts test.
- JSON module mocking in Vitest uses `vi.mock('path', () => ({ default: [...] }))` — default export required.
- `@testing-library/react` `renderHook` + `act` used for async hook state assertions.
