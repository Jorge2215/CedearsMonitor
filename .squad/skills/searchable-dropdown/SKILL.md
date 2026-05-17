# Skill: Searchable Dropdown (Custom Combobox) in React + Chakra UI

**Stack:** React 18, Chakra UI, Vitest + Testing Library  
**Pattern:** Custom ARIA combobox with inline match highlighting

## When to Use

Use this pattern when:
- You need a searchable select/autocomplete with filtering on multiple fields
- You want to stay within Chakra UI's component model (no react-select CSS battles)
- Your test suite uses `getByRole('combobox')`, `getByRole('listbox')`, `getByRole('option')` — the standard ARIA combobox contract

## Core Pattern

```jsx
// 1. Build options once at module scope (static data)
const allOptions = rawData
  .filter(({ Ticket }) => Ticket != null)
  .map(({ Ticket, Company }) => ({
    value: Ticket,
    label: `${Company ?? ""} (${Ticket})`,
    company: Company ?? "",
    ticket: Ticket,
  }))
  .sort((a, b) => a.label.localeCompare(b.label))

// 2. State: query (what's typed), isOpen, highlightedIndex
const [query, setQuery] = useState("")
const [isOpen, setIsOpen] = useState(false)
const [highlightedIndex, setHighlightedIndex] = useState(-1)

// 3. Filter: case-insensitive substring on multiple fields
const filtered = allOptions.filter(({ company, ticket }) => {
  const q = query.toLowerCase()
  if (!q.trim()) return true
  return company.toLowerCase().includes(q) || ticket.toLowerCase().includes(q)
})

// 4. Keyboard handler
function handleKeyDown(e) {
  switch (e.key) {
    case "ArrowDown": setHighlightedIndex(prev => prev >= filtered.length - 1 ? 0 : prev + 1); break
    case "ArrowUp":   setHighlightedIndex(prev => prev <= 0 ? filtered.length - 1 : prev - 1); break
    case "Enter":     if (highlightedIndex >= 0) selectOption(filtered[highlightedIndex]); break
    case "Escape":    close(); break
  }
}
```

## Critical: aria-label on Options

When you use `HighlightText` (or any component that wraps matched text in `<mark>` elements), **always add `aria-label={opt.label}` to each `role="option"` element**:

```jsx
<Box
  role="option"
  aria-label={opt.label}   // ← REQUIRED
  aria-selected={i === highlightedIndex}
>
  <HighlightText text={opt.label} query={query} />
</Box>
```

**Why:** jsdom's accessible name computation inserts spaces between adjacent inline elements (`<mark>` and `<span>`), turning "Garmin Ltd." into "Gar min Ltd.". The `aria-label` bypasses this and gives Testing Library a clean name to match against.

## Match Highlighting

```jsx
function HighlightText({ text, query }) {
  const trimmed = query.trim()
  if (!trimmed) return <span>{text}</span>
  const regex = new RegExp(`(${escapeRegex(trimmed)})`, "gi")
  const parts = text.split(regex)
  return (
    <span>
      {parts.map((part, i) =>
        new RegExp(`^${escapeRegex(trimmed)}$`, "i").test(part) ? (
          <mark key={i} style={{ background: "#CFFAFE", color: "#0891B2", fontWeight: 700 }}>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  )
}
```

## Visible Placeholder (getByText-compatible)

Render the placeholder as a visible `<Box>` so `getByText()` can find it (mirrors react-select behavior):

```jsx
{!isOpen && !selectedOption && (
  <Box position="absolute" left="12px" ... color="#94A3B8" pointerEvents="none" zIndex={1}>
    Search by name or ticker...
  </Box>
)}
```

Set the native input's `color` to `transparent` when the overlay text is shown:
```jsx
color: !isOpen && selectedOption ? "transparent" : "#0F172A"
```

## Blur / Focus Coordination

```jsx
// Defer close so option onClick fires before blur closes the dropdown
function handleInputBlur() {
  setTimeout(close, 100)
}

// Prevent listbox mousedown from stealing focus from the input
<Box role="listbox" onMouseDown={(e) => e.preventDefault()}>
```

## Scroll Highlighted Option Into View

```jsx
useEffect(() => {
  if (highlightedIndex >= 0 && isOpen) {
    const listbox = document.getElementById(listboxId)
    listbox?.children[highlightedIndex]?.scrollIntoView?.({ block: "nearest" })
  }
}, [highlightedIndex, isOpen, listboxId])
```

## ARIA Wiring

```jsx
<input
  role="combobox"
  aria-expanded={isOpen}
  aria-haspopup="listbox"
  aria-controls={isOpen ? listboxId : undefined}
  aria-activedescendant={highlightedIndex >= 0 ? `${listboxId}-opt-${highlightedIndex}` : undefined}
  aria-autocomplete="list"
  aria-label="Search label"
/>
<Box id={listboxId} role="listbox" aria-label="Options" ...>
  {filtered.map((opt, i) => (
    <Box id={`${listboxId}-opt-${i}`} role="option" aria-label={opt.label} aria-selected={i === highlightedIndex} ...>
      <HighlightText text={opt.label} query={query} />
    </Box>
  ))}
</Box>
```

## File Reference

- Implementation: `src/components/SearchableDropdown.jsx`
- Tests: `src/components/__tests__/SearchableDropdown.test.jsx`
- Re-export shim: `src/components/TickerDropdown.jsx`
