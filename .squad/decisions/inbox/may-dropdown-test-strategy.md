# Decision: SearchableDropdown Test Strategy

**Date:** 2026-05-17  
**Author:** May (Tester/QA)  
**Status:** Adopted  

---

## Context

Creta replaced the static `<select>`-based CEDEAR picker with a custom combobox (`SearchableDropdown.jsx`). The component:
- Filters `allOptions` (built from `CedearsList.json` at module scope) by `Ticket` and `Company`, case-insensitive, partial match.
- Highlights matched text via `HighlightText` (`<mark>` elements with inline styles).
- Manages open/close, keyboard navigation, and blur-defer via React local state and a 100 ms `setTimeout`.
- Re-exported transparently through `TickerDropdown.jsx`.

Test infrastructure: **Vitest + React Testing Library + jsdom** (confirmed working, 75 tests total as of this decision).

---

## Decision

### 1. Test file location
`src/components/__tests__/SearchableDropdown.test.jsx` — co-located with other component tests. Targets `TickerDropdown` (the re-export) to validate the public surface.

### 2. Mock strategy
Use a **module-level `vi.mock('../../data/CedearsList.json', ...)`** with a fixed 6-entry dataset. This is sufficient because `allOptions` is computed once at module load. Tests that require different data (e.g., null fields) must use `vi.resetModules()` + `vi.doMock()` in a separate describe scope — this is deferred (see §5 below).

### 3. Query strategy for options
The `HighlightText` component wraps matched substrings in `<mark>` elements, which JSDOM accessible-name computation splits with spaces. Rule:
- **Prefer matching the unhighlighted portion** of the option label (e.g., for query "gar", use `{ name: /GRMN/i }` which targets the ticker in parentheses, not the highlighted "Garmin").
- When the query matches a full token (e.g., "Garmin" matches "Garmin" whole-word), the accessible name is clean and the full company name can be used.

### 4. Interaction patterns
- Use **`userEvent`** for user-like interactions (click, keyboard navigation).
- Use **`fireEvent.change`** for setting input text programmatically — avoids userEvent simulating individual keystrokes for long strings and special characters.
- Use **`fireEvent.focus`** (not `userEvent.click`) when re-opening the dropdown immediately after a selection, to avoid a race against the 100 ms `setTimeout(close, ...)` blur handler.

### 5. Coverage tiers

| Tier | Status | Notes |
|------|--------|-------|
| Rendering (combobox, label, listbox visibility) | ✅ 4 tests | |
| Search by ticker (partial, full, dot-ticker) | ✅ 3 tests | |
| Search by company name | ✅ 2 tests | |
| Case insensitivity | ✅ 4 tests | |
| Partial match (1 char, multi-char, exclusions) | ✅ 4 tests | |
| Empty search — all options visible | ✅ 2 tests | |
| No match — empty state + message | ✅ 2 tests | |
| Selection (onChange, closes, value prop, special chars) | ✅ 4 tests | |
| Keyboard navigation (↓, ↑, wrap, Enter, Escape, filtered+Enter) | ✅ 7 tests | |
| Null/undefined data fields | ⏳ 5 todos | Needs `vi.resetModules()` harness |
| Special characters in query (&, ., spaces, SQL string, long input) | ✅ 5 tests | |
| ARIA attributes (aria-label, placeholder, aria-expanded lifecycle, listbox label) | ✅ 6 tests | |
| Double-selection safety | ✅ 2 tests | |

**Total active: 45 tests. Total todos: 5.**

### 6. Null-field todos
The 5 `it.todo` entries in §10 document the requirement that `SearchableDropdown` must not crash when `CedearsList.json` contains entries with null/undefined `Ticket` or `Company`. The component already guards `Ticket != null` at `allOptions` build time and uses `Company ?? ""`. When the implementation is verified stable, implement these tests using `vi.resetModules()` + `vi.doMock()` per test to supply poisoned data.

---

## Alternatives Rejected

- **react-select** wrapper instead of custom combobox: the team chose a custom combobox. The test file header referencing react-select was corrected.
- **Snapshot tests**: rejected — too fragile for a component with inline styles and dynamic IDs.
- **E2E tests (Playwright/Cypress)**: out of scope for this phase; component-level RTL tests are sufficient.
