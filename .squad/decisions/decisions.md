# Project Decisions ‚Äî CedearMonitor

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

# Component Prop Interfaces ‚Äî CedearMonitor UI

> Authored by Creta ¬∑ 2026-05-16

### TickerDropdown

File: `src/components/TickerDropdown.jsx`

Props:
- `value` (string) ‚Äî Currently selected ticker. Empty string means nothing selected.
- `onChange` ((ticker: string) => void) ‚Äî Called with the raw ticker string when the user picks an option.

Renders: a `<select>` populated from `CedearsList.json`, sorted alphabetically by `Company`. Option label format: `{Company} ({Ticket})`.

### DateRangePicker

File: `src/components/DateRangePicker.jsx`

Props:
- `dateFrom` (Date), `dateTo` (Date), `onDateFromChange`, `onDateToChange`.

Constraints: "To" date cannot be before "From". "To" date cannot exceed today. Display format: dd/MM/yyyy.

### DataTable

File: `src/components/DataTable.jsx`

Props: `data` ‚Äî array of OHLC records from `useCedearData`. May be empty.

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
- Empty or null `data` ‚Üí renders "No data available for the selected period."  
- Null/undefined prices ‚Üí rendered as `‚Äî`  
- Sorted ascending by date (oldest first)  
- Shows `Showing {n} records` count above the table

### PriceChart

File: `src/components/PriceChart.jsx`

Props: `data` (array), `ticker` (string)

Behaviour:
- Records with null `c` are filtered out before rendering.
- Empty filtered data ‚Üí renders "No chart data available."
- Tooltip shows Date, Close (bold), Open, High, Low.
- Chart line: Close price (`c`), color `#2563eb`.

---

## may-test-strategy.md

# May ‚Äî Test Strategy Decision

**Date:** 2026-05-16  
**Author:** May (Tester / QA)  
**Status:** Active

Summary: Establishes the test strategy for CedearMonitor: a React 18 + Vite 5 app. Testing uses Vitest + React Testing Library + jsdom.

Coverage Areas and test mapping are recorded (service, hook, component, integration). Financial edge cases documented: zero prices, null prices, empty array, date boundary inclusivity, stale/missing dates. Environment constraints (ResizeObserver mock, JSON module mocking, async hooks patterns) included.

---

## toru-react-vite-architecture.md

### 2026-05-16: Architecture Decision ‚Äî CedearMonitor Tech Stack
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


---

## toru-ui-framework.md

# UI Framework Decision

**Date:** 2026-05-16  
**Author:** Toru (Lead)  
**Status:** Approved

---

## Framework: Chakra UI v2

---

## Why Chakra UI over MUI

| Criterion | Chakra UI v2 | MUI v5 | Decision |
|---|---|---|---|
| Bundle size (gzipped) | ~100 KB | ~300 KB | ‚úÖ Chakra |
| Emotion overhead | ~20 KB (shared) | ~20 KB (shared) | Tie |
| DatePicker component | ‚ùå None | ‚úÖ @mui/x-date-pickers (+70 KB) | N/A ‚Äî keep react-datepicker |
| Theming complexity | Simple token-based extendTheme | Complex createTheme + sx prop | ‚úÖ Chakra |
| Table component | ‚úÖ Table/Thead/Tbody/Tr/Th/Td | ‚úÖ TableContainer/Table/etc. | Tie |
| Spinner | ‚úÖ `<Spinner />` | ‚úÖ `<CircularProgress />` | Tie |
| Select | ‚úÖ `<Select />` | ‚úÖ `<Select />` | Tie |
| Button | ‚úÖ `<Button />` | ‚úÖ `<Button />` | Tie |
| Vite 5 compat | ‚úÖ No issues | ‚úÖ No issues | Tie |
| CSS reset conflict risk | Medium (ChakraProvider resets) | High (CssBaseline aggressive) | ‚úÖ Chakra |

**Verdict:** Bundle size is the decisive factor. Recharts already triggers a chunk size warning. Adding MUI at +300 KB would push the main bundle well past 1 MB. Chakra at +100 KB is acceptable. The DatePicker situation is identical for both (neither justifies replacing react-datepicker which is already installed and working). Chakra's `extendTheme` token system is a better fit for a pastel financial dashboard than MUI's `createTheme`.

---

## Install Command

```bash
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

No additional packages needed. Keep existing `react-datepicker` and `date-fns`.

---

## Theme Configuration

File: `src/theme.js`

(Theme configuration omitted here; full theme stored in `.squad/decisions/inbox/toru-ui-framework.md`)

---

## toru-docs-updated.md

### 2026-05-16: README updated post Chakra UI migration
**By:** Toru
**What:** README.md updated to reflect Chakra UI v2 stack, project structure with theme.js, and Azure SWA deployment details
**Why:** Docs were stale after the UI overhaul


*Inbox files merged and removed from `.squad/decisions/inbox/`.*

---


# Decision: Searchable CEDEAR Dropdown ó Custom Combobox

**Date:** 2026-05-17T11:45:48  
**Author:** Creta  
**Status:** Implemented

## Context

The original TickerDropdown was a static <select> element. With 100+ CEDEARs in the list, users needed the ability to search by company name or ticker symbol. The task required a searchable autocomplete component consistent with the existing Chakra UI / Poppins visual theme.

## Decision

Implement a **fully custom combobox** (SearchableDropdown.jsx) using React state + Chakra UI Box/FormControl, rather than using eact-select (which is installed) or a Chakra-UI-specific library.

## Rationale

- **Test compatibility**: The existing test suite (SearchableDropdown.test.jsx, TickerDropdown.test.jsx) was written against a custom combobox contract ó it queries for ole="combobox", ole="listbox", ole="option" and checks ria-activedescendant for keyboard focus. eact-select's DOM structure diverges enough that adopting it would require rewriting all tests.
- **Visual consistency**: Direct use of Chakra UI Box components lets us inherit the theme tokens (brand turquoise #06B6D4, Poppins font, 14px border-radius, etc.) without custom CSS overrides.
- **No new dependency**: eact-select is already installed but its benefit is reduced when the existing tests already specify the ARIA contract in detail.

## Implementation Notes

- Options built once at module scope: llOptions = cedearsData.filter(...).map(...).sort(localeCompare).
- Filtering is case-insensitive substring match on both 	icket and company fields.
- HighlightText wraps matched text in <mark> for visual highlight; each ole="option" element carries ria-label={opt.label} to provide a clean accessible name (avoids jsdom's space-insertion between <mark>/<span> elements during accessible name computation).
- Keyboard: ArrowDown/ArrowUp cycle through filtered options with wrap-around; Enter selects; Escape closes.
- Placeholder is rendered as a visible <Box> (not just input[placeholder]) so getByText() assertions work ó mirrors the react-select placeholder pattern.
- Empty state: "No CEDEARs found".
- TickerDropdown.jsx re-exports SearchableDropdown as its default ó single source of truth.

## Alternatives Considered

| Option | Pros | Cons |
|---|---|---|
| eact-select | Battle-tested, rich UX | DOM structure incompatible with existing tests; requires CSS overrides for Chakra theme |
| @chakra-ui/autocomplete (3rd party) | Chakra-native | Not installed; adds a dependency; less control |
| Custom combobox (chosen) | Full control, theme-native, test-compatible | More code to maintain |

---


# Decision: SearchableDropdown Test Strategy

**Date:** 2026-05-17  
**Author:** May (Tester/QA)  
**Status:** Adopted  

---

## Context

Creta replaced the static <select>-based CEDEAR picker with a custom combobox (SearchableDropdown.jsx). The component:
- Filters llOptions (built from CedearsList.json at module scope) by Ticket and Company, case-insensitive, partial match.
- Highlights matched text via HighlightText (<mark> elements with inline styles).
- Manages open/close, keyboard navigation, and blur-defer via React local state and a 100 ms setTimeout.
- Re-exported transparently through TickerDropdown.jsx.

Test infrastructure: **Vitest + React Testing Library + jsdom** (confirmed working, 75 tests total as of this decision).

---

## Decision

### 1. Test file location
src/components/__tests__/SearchableDropdown.test.jsx ó co-located with other component tests. Targets TickerDropdown (the re-export) to validate the public surface.

### 2. Mock strategy
Use a **module-level i.mock('../../data/CedearsList.json', ...)** with a fixed 6-entry dataset. This is sufficient because llOptions is computed once at module load. Tests that require different data (e.g., null fields) must use i.resetModules() + i.doMock() in a separate describe scope ó this is deferred (see ß5 below).

### 3. Query strategy for options
The HighlightText component wraps matched substrings in <mark> elements, which JSDOM accessible-name computation splits with spaces. Rule:
- **Prefer matching the unhighlighted portion** of the option label (e.g., for query "gar", use { name: /GRMN/i } which targets the ticker in parentheses, not the highlighted "Garmin").
- When the query matches a full token (e.g., "Garmin" matches "Garmin" whole-word), the accessible name is clean and the full company name can be used.

### 4. Interaction patterns
- Use **userEvent** for user-like interactions (click, keyboard navigation).
- Use **ireEvent.change** for setting input text programmatically ó avoids userEvent simulating individual keystrokes for long strings and special characters.
- Use **ireEvent.focus** (not userEvent.click) when re-opening the dropdown immediately after a selection, to avoid a race against the 100 ms setTimeout(close, ...) blur handler.

### 5. Coverage tiers

| Tier | Status | Notes |
|------|--------|-------|
| Rendering (combobox, label, listbox visibility) | ? 4 tests | |
| Search by ticker (partial, full, dot-ticker) | ? 3 tests | |
| Search by company name | ? 2 tests | |
| Case insensitivity | ? 4 tests | |
| Partial match (1 char, multi-char, exclusions) | ? 4 tests | |
| Empty search ó all options visible | ? 2 tests | |
| No match ó empty state + message | ? 2 tests | |
| Selection (onChange, closes, value prop, special chars) | ? 4 tests | |
| Keyboard navigation (?, ?, wrap, Enter, Escape, filtered+Enter) | ? 7 tests | |
| Null/undefined data fields | ? 5 todos | Needs i.resetModules() harness |
| Special characters in query (&, ., spaces, SQL string, long input) | ? 5 tests | |
| ARIA attributes (aria-label, placeholder, aria-expanded lifecycle, listbox label) | ? 6 tests | |
| Double-selection safety | ? 2 tests | |

**Total active: 45 tests. Total todos: 5.**

### 6. Null-field todos
The 5 it.todo entries in ß10 document the requirement that SearchableDropdown must not crash when CedearsList.json contains entries with null/undefined Ticket or Company. The component already guards Ticket != null at llOptions build time and uses Company ?? "". When the implementation is verified stable, implement these tests using i.resetModules() + i.doMock() per test to supply poisoned data.

---

## Alternatives Rejected

- **react-select** wrapper instead of custom combobox: the team chose a custom combobox. The test file header referencing react-select was corrected.
- **Snapshot tests**: rejected ó too fragile for a component with inline styles and dynamic IDs.
- **E2E tests (Playwright/Cypress)**: out of scope for this phase; component-level RTL tests are sufficient.

---


# Decision: react-select v5 Test Patterns for TickerDropdown

**Date:** 2026-05-17  
**Author:** May (Tester/QA)  
**Status:** Adopted  

---

## Context

TickerDropdown.jsx was upgraded from a static <select> to a **react-select v5** searchable combobox filtering CedearsList.json by both Ticker and Company fields. The existing TickerDropdown.test.jsx (3 tests failing) and App.test.jsx (0 tests using the dropdown) required updating. A new comprehensive SearchableDropdown.test.jsx (45 active tests + 5 todos) was written to cover the full public surface.

---

## Decision

### 1. react-select DOM querying rules

| What to test | How to query |
|---|---|
| Combobox input | screen.getByRole('combobox') |
| Placeholder text | screen.getByText('Search CEDEAR by name or ticker...') (it's a <div>, not an attribute) |
| Selected value | screen.getByText('MSFT') inside .react-select__single-value |
| Open menu | Assert screen.getByRole('listbox') is in the document |
| Options | screen.getAllByRole('option') ó only available when menu is open |
| Focused option | Check ria-activedescendant on the combobox input |
| No-match state | screen.getByText('No CEDEARs found') |

### 2. Interaction patterns

- **Open menu:** wait userEvent.click(comboboxInput) ó react-select listens to mousedown, and userEvent correctly dispatches it.
- **Type to filter:** ireEvent.change(input, { target: { value: 'ABC' } }) ó do NOT use userEvent.type() because react-select's internal event chain fires multiple synthetic events per character, making the full test suite ~10◊ slower.
- **Select option:** wait userEvent.click(optionElement).
- **Keyboard navigation:** wait userEvent.keyboard('{ArrowDown}') etc. ó works normally.
- **Escape to close:** wait userEvent.keyboard('{Escape}').

### 3. App.test.jsx ó stub TickerDropdown

Add a i.mock('../TickerDropdown', ...) stub in App.test.jsx that renders a plain button. This decouples App integration tests from react-select internals entirely:

`js
vi.mock('../TickerDropdown', () => ({
  default: ({ onChange }) => (
    <button onClick={() => onChange('MSFT')}>Select MSFT</button>
  ),
}))
`

### 4. Module-scope options array

TickerDropdown.jsx computes sorted and options at the TOP LEVEL of the module (not inside the component). This means i.mock('../../data/CedearsList.json', ...) in eforeEach has NO EFFECT on rendered options.

- **Standard tests:** use one i.mock(...) at the top of the file; the mocked data is fixed for all tests.
- **Tests requiring different data** (null fields, empty list): must use i.resetModules() + i.doMock() + dynamic wait import('../TickerDropdown') per test. This pattern is complex and slow ó the 5 null-field tests are currently it.todo() entries.

### 5. Null-field risk

ilterOption in TickerDropdown.jsx (line 132ñ138) accesses data.company and data.ticket with no null guards. If CedearsList.json ever contains entries missing these fields, the filter will crash. **Recommendation:** add null guards:

`js
function filterOption({ data }, inputValue) {
  if (!inputValue) return true
  const q = inputValue.toLowerCase()
  return (data.company ?? '').toLowerCase().includes(q) ||
         (data.ticket ?? '').toLowerCase().includes(q)
}
`

Once the fix is in, implement the 5 it.todo tests using the i.resetModules() harness.

### 6. Coverage summary

| Section | Tests |
|---|---|
| Rendering (combobox, label, listbox visibility) | 4 |
| Search by ticker | 3 |
| Search by company name | 2 |
| Case insensitivity | 4 |
| Partial match | 4 |
| Empty search ó all options visible | 2 |
| No match ó empty state + message | 2 |
| Selection (onChange, closes, value prop, special chars) | 4 |
| Keyboard navigation (?, ?, Enter, Escape, filtered+Enter) | 5 |
| Special characters in query | 5 |
| Null/undefined data fields | 5 (todos) |
| **Total** | **45 active + 5 todos = 50** |

---

## Alternatives Rejected

- **userEvent.type() for search input:** works correctly but makes the 50-test suite take minutes. Replaced with ireEvent.change.
- **Snapshot tests:** too fragile with react-select's generated class names and IDs.
- **Testing react-select internals:** we test behavior (options visible, onChange called) not react-select's own implementation.
