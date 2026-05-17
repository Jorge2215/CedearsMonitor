# Project Context

- **Owner:** Jorge2215
- **Project:** CedearMonitor — Web App for Financial Information (CEDEAR market data)
- **Stack:** TBD
- **Created:** 2026-05-16

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-05-16: Phase 1 — Data layer finalized
- Implemented `cedearService` and `useCedearData` with input validation, network/HTTP error handling, and inclusive client-side date filtering normalized to local midnight. Wrote initial tests for service and hook.
- Outcome: Service and hook functioning; contributed to final test pass.


### 2026-05-16 — Data layer implementation

**API integration:** Direct browser-to-API calls via global `fetch` to `https://data912.com/historical/cedears/{ticker}`. No proxy. Ticker is normalized to uppercase and URL-encoded before use.

**Error handling:** Two failure modes are distinguished — network errors (fetch rejects) are caught and re-thrown with context; non-ok HTTP responses throw with status code and text. Invalid ticker input is validated at the boundary before any network call.

**Date filtering:** The API returns full history; filtering is client-side in the hook. Dates are normalized to midnight (local time) using `new Date(year, month, day)` before numeric comparison. This avoids timezone-related off-by-one errors from `YYYY-MM-DD` strings parsed via `new Date(string)` (which produces UTC midnight). Filtering is inclusive on both ends.

**Hook design:** `fetchData` is memoized with `useCallback([], [])` so callers get a stable reference across renders. Error state is cleared at the start of each new fetch, so a successful retry always results in `error: null`.
