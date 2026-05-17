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

