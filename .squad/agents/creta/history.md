# Project Context

- **Owner:** Jorge2215
- **Project:** CedearMonitor — Web App for Financial Information (CEDEAR market data)
- **Stack:** React 18 + Vite, Recharts, react-datepicker, date-fns
- **Created:** 2026-05-16

## Learnings

### 2026-05-16 — Component architecture decisions

- **TickerDropdown**: Imports `CedearsList.json` directly as a static asset. Options are sorted alphabetically by `Company` at render time using `Array.sort` + `localeCompare`. No need for memo since the list is static.
- **DateRangePicker**: Uses `react-datepicker` with `selectsStart`/`selectsEnd` props to link the two pickers. `maxDate` on the "From" picker is set to `dateTo`, and `minDate` on the "To" picker is set to `dateFrom` — this enforces chronological integrity without extra validation logic.
- **DataTable**: Sorts data by date ascending (oldest first, newest last) using `new Date()` comparison. Null/undefined prices rendered as `—` via a `formatPrice` helper. Row striping via `row-even`/`row-odd` CSS classes on `<tr>`.
- **PriceChart**: Filters out records with null `c` before passing to Recharts. `CustomTooltip` renders all four OHLC values. `interval="preserveStartEnd"` on XAxis avoids label crowding on long date ranges. Line `dot={false}` for performance with large datasets.
- **CSS variable system**: All design tokens live in `index.css` under `:root`. Components reference `var(--color-primary)`, `var(--color-border)`, `var(--radius-*)`, `var(--shadow-*)` etc. Never hardcode color values except the chart line `#2563eb` (matches `--color-primary`).
- **Recharts usage patterns**: `ResponsiveContainer width="100%" height={350}` is the standard wrapper. `YAxis domain={['auto', 'auto']}` lets Recharts pick sensible min/max. `strokeWidth={2}` and `dot={false}` are the preferred line style for financial time series.

### 2026-05-16: Phase 1 — Component implementation
- Implemented TickerDropdown, DateRangePicker, DataTable, PriceChart, and responsive CSS variables. Ensured prop interfaces and empty/null handling align with test expectations.
- Outcome: Components integrated and validated by tests.

### 2026-05-16T22:36:58 — Visual redesign
- Delivered full visual redesign (turquoise/coral/Poppins theme) with gradient AreaChart, pill buttons, and header bar with tagline.
- Build passed and changes pushed to `dev` (commit: d48ea79).

### 2026-05-17T11:45:48 — Searchable CEDEAR Autocomplete

**What I found:**
- `TickerDropdown.jsx` already delegated to a `SearchableDropdown.jsx` that had been partially built — the filtering, keyboard navigation (ArrowUp/Down/Enter/Escape), match highlighting, and ARIA combobox wiring were all in place.
- The existing component had 4 failing tests out of 72:
  1. Empty-state message was "Sin resultados" but tests expected "No CEDEARs found".
  2. `TickerDropdown.test.jsx` expected `getByText(/Search CEDEAR by name or ticker/i)` as a visible DOM element — the placeholder was only an input attribute.
  3. Two partial-match tests failed because `HighlightText` wraps matched text in `<mark>` elements; jsdom's accessible name algorithm inserts spaces between inline elements during computation (e.g. `"Gar" + " " + "min Ltd."` → "Gar min Ltd." instead of "Garmin Ltd."), so `getByRole('option', { name: /Garmin/i })` couldn't find the element.

**What I built / fixed:**
- Added `aria-label={opt.label}` on every `role="option"` Box — this gives each option a clean, space-free accessible name that bypasses the `<mark>`/`<span>` fragmentation issue. Screen readers still see the full label; the highlight is visual only.
- Changed "Sin resultados" → "No CEDEARs found" to match test expectations.
- The placeholder div (already present in the component, rendering the placeholder text as a visible `<Box>` when the dropdown is closed and no value is selected) resolved the `getByText` test requirement.

**Key decisions:**
- Chose a fully custom combobox over `react-select` (already installed) — the custom implementation integrates more naturally with Chakra UI's Box/FormControl and avoids the react-select DOM structure mismatch with existing tests.
- `aria-label` on options is the correct accessibility pattern when inner content is visually decorated but not semantically ideal for screen reader narration.
- All 67 tests pass (5 todos remaining for null/undefined data edge cases requiring `vi.resetModules()` isolation harness).
- Commit: `cc4b02b`



### 2026-05-17T15:03:55Z � SearchableDropdown implemented
- Implemented SearchableDropdown.jsx (custom combobox). Filtering on Ticket and Company, keyboard navigation (Arrow keys, Enter, Escape), match highlighting, aria-label on options to fix accessible-name fragmentation.
- Fixed 4 failing tests; all tests passing. Commit: cc4b02b


### 2026-05-17T20:15:12 - Data Export Feature (CSV + Excel)

**Data shape found:**
- Hook `useCedearData` returns `Array<{date: string, o: number, h: number, l: number, c: number}>` - OHLC only, no volume field.
- Selected ticker is plain `string` state in App.jsx. Data available via `data` state; `loading` boolean guards the button.

**What was built:**
- `src/components/ExportButton.jsx` - standalone component accepting `{ data, ticker, loading }` props.
- CSV: native Blob API -> `URL.createObjectURL` -> anchor click -> `URL.revokeObjectURL`. Columns: Date, Open, High, Low, Close.
- Excel: SheetJS `xlsx` library (`npm install xlsx`). `XLSX.utils.json_to_sheet` + `XLSX.writeFile`. Column widths set via `ws['!cols']`.
- Both buttons disabled when `loading || data.length === 0`. `useToast` for success/error feedback.
- Placed in DataTable card header using `Flex justify=space-between`. File naming: `Cedear_<Ticker>_<YYYY-MM-DD>.<ext>`.
- Build passed (2176 modules). Commit: a6868ce.

### 2026-05-17T23:42:26Z � Export feature merged
- ExportButton.jsx implemented, commit ea02a3c. CSV + Excel export added. Known gaps: volume column, filename sanitization.


### 2026-05-17T21:04:24 - Wind-Up Bird Chronicle Easter Egg

**Image path:** `Images/WindupBird.jpg` lives at the repo root (not `public/`). Imported as a Vite module asset -- Vite fingerprints and bundles it automatically. No `public/` directory exists in this project.

**Header integration:** Added `width="100%"` to the header `<Flex>` so `ml="auto"` on the image correctly pushes it to the right edge. `WindUpBirdEasterEgg` is a Fragment component (Image + Modal) -- it slots cleanly as the last child of the Flex.

**Chakra UI v2 Modal pattern:** `useDisclosure()` returns `{ isOpen, onOpen, onClose }`. Modal composition: `<Modal> + <ModalOverlay /> + <ModalContent> + <ModalCloseButton /> + <ModalBody>`. Idiomatic Chakra v2 pattern; no ModalHeader needed for a styled quote.

**Quote constant:** Named `WIND_UP_BIRD_QUOTE` at line 5 of `WindUpBirdEasterEgg.jsx`, marked with `// QUOTE_PLACEHOLDER` comment. Jorge can find-and-replace in one place.

**Build:** 2178 modules, image bundled as `WindupBird-BxjFF9W3.jpg` in `dist/assets/`. No errors.
