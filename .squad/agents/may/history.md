# Project Context

- **Owner:** Jorge2215
- **Project:** CedearMonitor — Web App for Financial Information (CEDEAR market data)
- **Stack:** TBD
- **Created:** 2026-05-16

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-05-17 — SearchableDropdown test suite

- **Component:** `SearchableDropdown.jsx` (custom combobox, NOT react-select). Re-exported via `TickerDropdown.jsx`. `allOptions` is computed at module scope — vi.mock intercepts at load time.
- **Test file:** `src/components/__tests__/SearchableDropdown.test.jsx` — already existed as a stub; expanded to 50 tests (45 active + 5 todos).
- **Sections added:** §12 ARIA attributes (aria-label, placeholder, aria-expanded lifecycle, listbox aria-label) and §13 Double-selection safety.
- **Key gotcha — HighlightText accessible names:** The `HighlightText` component wraps matched text in `<mark>` elements. JSDOM's accessible name computation inserts a space between sibling DOM nodes, so `role="option" { name: /Garmin/i }` fails when "gar" is highlighted as `<mark>Gar</mark><span>min…</span>`. Tests that rely on full-string accessible names must use a term that is highlighted as a complete token (e.g., query="Garmin" highlights the whole word and the accessible name is clean). Short partial queries ("gar", "alph") produce split nodes — tests for those groups use `{ name: /GRMN/i }` (matching the unhighlighted ticker part) to avoid this issue.
- **Key gotcha — blur-timer race in double-selection tests:** `handleInputBlur` uses `setTimeout(close, 100)`. In tests that simulate two sequential selections, re-opening with `userEvent.click` can race against the pending 100ms timer. Use `fireEvent.focus` (synchronous) for the re-open step to avoid this.
- **5 remaining todos:** null/undefined Ticket or Company fields in data — require `vi.resetModules()` + `vi.doMock()` per test because `allOptions` is module-scoped. Deferred to avoid test suite hangs from re-importing heavy deps.

### 2026-05-16: Phase 1 testing completion
- Authored comprehensive test suite (30 tests) across service, hook, components, and integration. Tests cover financial edge cases and environment constraints.
- Outcome: All tests passing (30/30), enabling safe iteration in subsequent phases.


### 2026-05-16 — Post-Redesign Test Fix (turquoise/coral theme)

- Creta's visual redesign introduced custom Chakra UI theme tokens (`colors.brand.primary`, etc.).
- `App.test.jsx` was importing `render` from `@testing-library/react` directly (no `ChakraProvider`), causing all 5 App tests to crash with `TypeError: Cannot use 'in' operator to search for 'colors.brand.primary' in undefined`.
- Fix: import `render` from `../../test-utils` (which wraps with `ChakraProvider` + custom theme).
- **Rule confirmed:** Any component test that renders Chakra UI components with custom theme tokens MUST use `render` from `test-utils.jsx`, not directly from `@testing-library/react`.
- Outcome: 30/30 tests passing. Committed to `dev`.

### 2026-05-16T22:36:58 — Visual redesign verification
- Verified visual redesign changes and full test pass (30/30).
- Fixed `App.test.jsx` import to use `test-utils` wrapper (ChakraProvider + custom theme).
- Verification pushed to `dev`.

### 2026-05-16 — Test Strategy Established

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
