import { useState, useRef, useEffect, useId } from "react"
import { FormControl, FormLabel, Box } from "@chakra-ui/react"
import cedearsData from "../data/CedearsList.json"

// ---------------------------------------------------------------------------
// Build options once — filter out null/undefined Ticket entries
// ---------------------------------------------------------------------------
const allOptions = cedearsData
  .filter(({ Ticket }) => Ticket != null)
  .map(({ Ticket, Company }) => ({
    value: Ticket,
    label: `${Company ?? ""} (${Ticket})`,
    company: Company ?? "",
    ticket: Ticket,
  }))
  .sort((a, b) => a.label.localeCompare(b.label))

// ---------------------------------------------------------------------------
// Highlight matching text in an option label
// ---------------------------------------------------------------------------
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function HighlightText({ text, query }) {
  const trimmed = query.trim()
  if (!trimmed) return <span>{text}</span>
  let regex
  try {
    regex = new RegExp(`(${escapeRegex(trimmed)})`, "gi")
  } catch {
    return <span>{text}</span>
  }
  const parts = text.split(regex)
  return (
    <span>
      {parts.map((part, i) => {
        const r = new RegExp(`^${escapeRegex(trimmed)}$`, "i")
        return r.test(part) ? (
          <mark
            key={i}
            style={{
              background: "#CFFAFE",
              color: "#0891B2",
              fontWeight: 700,
              borderRadius: "2px",
              padding: "0 1px",
            }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      })}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Searchable combobox
// ---------------------------------------------------------------------------
export default function SearchableDropdown({ value, onChange }) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef(null)
  const uid = useId()
  const listboxId = `${uid}-listbox`

  const selectedOption = allOptions.find((o) => o.value === value) ?? null

  // Filter options based on current query
  const filtered = allOptions.filter(({ company, ticket }) => {
    const q = query.toLowerCase()
    if (!q.trim()) return true
    return company.toLowerCase().includes(q) || ticket.toLowerCase().includes(q)
  })

  function open() {
    setQuery("")
    setIsOpen(true)
    setHighlightedIndex(-1)
  }

  function close() {
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  function selectOption(opt) {
    if (opt.value != null) {
      onChange(opt.value)
    }
    close()
  }

  function handleInputChange(e) {
    setQuery(e.target.value)
    setHighlightedIndex(-1)
    if (!isOpen) setIsOpen(true)
  }

  function handleInputFocus() {
    if (!isOpen) open()
  }

  function handleInputBlur() {
    // Immediately close — mousedown on listbox uses e.preventDefault() so clicks
    // on options do not trigger blur; this path only runs on external blur (Tab, click-outside)
    close()
  }

  function handleKeyDown(e) {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault()
        open()
      }
      return
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev >= filtered.length - 1 ? 0 : prev + 1
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev <= 0 ? filtered.length - 1 : prev - 1
        )
        break
      case "Enter":
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
          selectOption(filtered[highlightedIndex])
        }
        break
      case "Escape":
        e.preventDefault()
        close()
        break
      default:
        break
    }
  }

  // Scroll keyboard-highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && isOpen) {
      const listbox = document.getElementById(listboxId)
      if (listbox) {
        const opt = listbox.children[highlightedIndex]
        opt?.scrollIntoView?.({ block: "nearest" })
      }
    }
  }, [highlightedIndex, isOpen, listboxId])

  const activeDescendantId =
    highlightedIndex >= 0 ? `${listboxId}-opt-${highlightedIndex}` : undefined

  return (
    <FormControl minW={{ base: "100%", md: "280px" }} flex="1">
      <FormLabel
        htmlFor="ticker-select"
        fontSize="sm"
        fontWeight="600"
        color="text.secondary"
        mb={1}
      >
        CEDEAR
      </FormLabel>
      <Box position="relative" w="100%">
        {/* Placeholder or selected value — rendered as visible DOM text so tests can find via getByText() */}
        {!isOpen && (
          <Box
            position="absolute"
            left="12px"
            top="50%"
            transform="translateY(-50%)"
            fontSize="14px"
            fontFamily="'Poppins', sans-serif"
            color={selectedOption ? "#0F172A" : "#94A3B8"}
            pointerEvents="none"
            maxW="calc(100% - 48px)"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            zIndex={1}
          >
            {selectedOption ? selectedOption.label : "Search CEDEAR by name or ticker..."}
          </Box>
        )}

        <input
          id="ticker-select"
          ref={inputRef}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={isOpen ? listboxId : undefined}
          aria-activedescendant={activeDescendantId}
          aria-autocomplete="list"
          aria-label="CEDEAR search"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder="Search CEDEAR by name or ticker..."
          autoComplete="off"
          style={{
            width: "100%",
            height: "40px",
            borderRadius: "14px",
            border: `1px solid ${isOpen ? "#06B6D4" : "#E2E8F0"}`,
            padding: "0 40px 0 12px",
            fontSize: "14px",
            fontFamily: "'Poppins', sans-serif",
            outline: "none",
            background: "white",
            color: !isOpen && selectedOption ? "transparent" : "#0F172A",
            boxShadow: isOpen ? "0 0 0 3px rgba(6,182,212,0.20)" : "none",
            transition: "border-color 0.15s ease, box-shadow 0.15s ease",
            position: "relative",
            zIndex: 0,
          }}
        />

        {/* Chevron indicator */}
        <Box
          position="absolute"
          right="12px"
          top="50%"
          color={isOpen ? "#06B6D4" : "#94A3B8"}
          pointerEvents="none"
          style={{
            transform: `translateY(-50%) rotate(${isOpen ? 180 : 0}deg)`,
            transition: "color 0.15s ease, transform 0.2s ease",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Box>

        {isOpen && (
          <Box
            id={listboxId}
            role="listbox"
            aria-label="CEDEARs"
            position="absolute"
            top="calc(100% + 4px)"
            left={0}
            right={0}
            zIndex={1500}
            bg="white"
            border="1px solid #E2E8F0"
            borderRadius="12px"
            boxShadow="0 10px 25px rgba(0,0,0,0.10)"
            overflow="hidden"
            maxH="260px"
            overflowY="auto"
            py="4px"
            // Prevent mousedown from stealing focus from the input
            onMouseDown={(e) => e.preventDefault()}
          >
            {filtered.length === 0 ? (
              <Box
                px={3}
                py={3}
                fontSize="14px"
                color="#94A3B8"
                fontFamily="'Poppins', sans-serif"
              >
                No CEDEARs found
              </Box>
            ) : (
              filtered.map((opt, i) => (
                <Box
                  key={opt.value}
                  id={`${listboxId}-opt-${i}`}
                  role="option"
                  aria-label={opt.label}
                  aria-selected={i === highlightedIndex}
                  onClick={() => selectOption(opt)}
                  onMouseEnter={() => setHighlightedIndex(i)}
                  px={3}
                  py={2}
                  borderRadius="8px"
                  mx="4px"
                  fontSize="14px"
                  fontFamily="'Poppins', sans-serif"
                  color={
                    i === highlightedIndex && value === opt.value
                      ? "white"
                      : "#0F172A"
                  }
                  bg={
                    i === highlightedIndex
                      ? value === opt.value
                        ? "#06B6D4"
                        : "#CFFAFE"
                      : value === opt.value
                      ? "rgba(6,182,212,0.1)"
                      : "transparent"
                  }
                  cursor="pointer"
                  transition="background 0.1s"
                  userSelect="none"
                >
                  <HighlightText text={opt.label} query={query} />
                </Box>
              ))
            )}
          </Box>
        )}
      </Box>
    </FormControl>
  )
}
