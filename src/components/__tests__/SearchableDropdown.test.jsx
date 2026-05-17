/**
 * Tests for the searchable CEDEAR selector (TickerDropdown, powered by react-select).
 *
 * Component: src/components/TickerDropdown.jsx
 * Contract:  <TickerDropdown value={string} onChange={fn(ticket: string)} />
 *
 * Rendering:
 *   - An <input> with role="combobox" and aria-label="CEDEAR search"
 *   - A visible "CEDEAR" label above the control
 *   - A listbox (role="listbox") that appears when the control is open
 *   - Options (role="option") showing "{Company} ({Ticket})"
 *
 * Behaviour:
 *   - Empty search → all options visible
 *   - Typing filters by Ticket OR Company, case-insensitive, partial match
 *   - No match → "No CEDEARs found" message, no options rendered
 *   - Click option → calls onChange(Ticket), closes listbox
 *   - ArrowDown/Up cycle through options; Enter selects; Escape closes
 *   - `value` prop displays selected item's label in the control
 *   - Null/undefined Ticket or Company fields must not crash the component
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test-utils'
import userEvent from '@testing-library/user-event'
import TickerDropdown from '../TickerDropdown'

// ---------------------------------------------------------------------------
// Module-level mock — NOTE: TickerDropdown.jsx computes `sorted`/`options`
// at module scope, so this data is fixed for the entire file after first load.
// Edge-case tests requiring different data use vi.resetModules() + dynamic import.
// ---------------------------------------------------------------------------
vi.mock('../../data/CedearsList.json', () => ({
  default: [
    { Ticket: 'GRMN', Company: 'Garmin Ltd.' },
    { Ticket: 'GOOGL', Company: 'Alphabet Inc.' },
    { Ticket: 'AAPL', Company: 'Apple Inc.' },
    { Ticket: 'ANF', Company: 'Abercrombie & Fitch Co.' },
    { Ticket: 'BA.C', Company: 'Bank of America Corp.' },
    { Ticket: 'SPY', Company: 'SPDR S&P 500 ETF Trust' },
  ],
}))

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function setup(props = {}) {
  const user = userEvent.setup()
  const onChange = vi.fn()
  render(<TickerDropdown value="" onChange={onChange} {...props} />)
  return { user, onChange }
}

// ---------------------------------------------------------------------------
// 1. Rendering
// ---------------------------------------------------------------------------
describe('SearchableDropdown — rendering', () => {
  it('renders a combobox input', () => {
    setup()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders a visible CEDEAR label', () => {
    setup()
    expect(screen.getByText('CEDEAR')).toBeInTheDocument()
  })

  it('shows no listbox before the control is opened', () => {
    setup()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('opens the listbox when the input is clicked', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// 2. Happy path — search by ticker
// ---------------------------------------------------------------------------
describe('SearchableDropdown — search by ticker', () => {
  it('searching "GRMN" shows Garmin Ltd.', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'GRMN' } })
    expect(screen.getByRole('option', { name: /Garmin Ltd\./i })).toBeInTheDocument()
  })

  it('searching "GRMN" does not show unrelated entries', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'GRMN' } })
    expect(screen.queryByRole('option', { name: /Alphabet/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /Apple/i })).not.toBeInTheDocument()
  })

  it('searching "BA.C" matches the dot-containing ticker', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'BA.C' } })
    expect(screen.getByRole('option', { name: /Bank of America/i })).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// 3. Happy path — search by company name
// ---------------------------------------------------------------------------
describe('SearchableDropdown — search by company name', () => {
  it('searching "Garmin" shows GRMN', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'Garmin' } })
    expect(screen.getByRole('option', { name: /GRMN/i })).toBeInTheDocument()
  })

  it('searching "Alphabet" shows GOOGL', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'Alphabet' } })
    expect(screen.getByRole('option', { name: /GOOGL/i })).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// 4. Case-insensitive search
// ---------------------------------------------------------------------------
describe('SearchableDropdown — case insensitivity', () => {
  it('lowercase ticker "grmn" matches GRMN', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'grmn' } })
    expect(screen.getByRole('option', { name: /Garmin/i })).toBeInTheDocument()
  })

  it('lowercase company "garmin" matches Garmin Ltd.', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'garmin' } })
    expect(screen.getByRole('option', { name: /GRMN/i })).toBeInTheDocument()
  })

  it('uppercase "APPLE" matches Apple Inc.', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'APPLE' } })
    expect(screen.getByRole('option', { name: /AAPL/i })).toBeInTheDocument()
  })

  it('mixed case "aLpHaBeT" matches Alphabet Inc.', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'aLpHaBeT' } })
    expect(screen.getByRole('option', { name: /GOOGL/i })).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// 5. Partial match
// ---------------------------------------------------------------------------
describe('SearchableDropdown — partial match', () => {
  it('"gar" matches Garmin Ltd.', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'gar' } })
    expect(screen.getByRole('option', { name: /Garmin/i })).toBeInTheDocument()
  })

  it('"alph" matches Alphabet Inc.', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'alph' } })
    expect(screen.getByRole('option', { name: /GOOGL/i })).toBeInTheDocument()
  })

  it('"GOO" matches GOOGL only', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'GOO' } })
    expect(screen.getByRole('option', { name: /GOOGL/i })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /GRMN/i })).not.toBeInTheDocument()
  })

  it('"G" matches GRMN and GOOGL (ticker prefix)', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'G' } })
    const options = screen.getAllByRole('option')
    const labels = options.map((o) => o.textContent)
    expect(labels.some((l) => /GRMN/i.test(l))).toBe(true)
    expect(labels.some((l) => /GOOGL/i.test(l))).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// 6. Empty search
// ---------------------------------------------------------------------------
describe('SearchableDropdown — empty search string', () => {
  it('shows all options when input is focused but empty', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('combobox'))
    // 6 entries in mock data
    expect(screen.getAllByRole('option')).toHaveLength(6)
  })

  it('clears filter and shows all options after resetting search text', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'GRMN' } })
    expect(screen.getAllByRole('option')).toHaveLength(1)
    fireEvent.change(input, { target: { value: '' } })
    expect(screen.getAllByRole('option')).toHaveLength(6)
  })
})

// ---------------------------------------------------------------------------
// 7. No match — empty state
// ---------------------------------------------------------------------------
describe('SearchableDropdown — no match', () => {
  it('shows no options when query matches nothing', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'ZZZZNOTFOUND' } })
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
  })

  it('shows "No CEDEARs found" when no results match', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'ZZZZNOTFOUND' } })
    // Matches the noOptionsMessage defined in TickerDropdown: 'No CEDEARs found'
    expect(screen.getByText(/No CEDEARs found/i)).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// 8. Selection behaviour
// ---------------------------------------------------------------------------
describe('SearchableDropdown — selection', () => {
  it('clicking an option calls onChange with its Ticket value', async () => {
    const { user, onChange } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'Garmin' } })
    await user.click(screen.getByRole('option', { name: /GRMN/i }))
    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith('GRMN')
  })

  it('selecting an option closes the listbox', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'Garmin' } })
    await user.click(screen.getByRole('option', { name: /GRMN/i }))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('reflects the current value prop as the visible selected label', () => {
    setup({ value: 'GRMN' })
    // react-select renders the selected item in a singleValue container, not
    // the raw input's .value attribute. Check the displayed label text.
    expect(screen.getByText(/Garmin Ltd\./i)).toBeInTheDocument()
  })

  it('clicking an option with "&" in company name calls onChange correctly', async () => {
    const { user, onChange } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'Abercrombie' } })
    await user.click(screen.getByRole('option', { name: /ANF/i }))
    expect(onChange).toHaveBeenCalledWith('ANF')
  })
})

// ---------------------------------------------------------------------------
// 9. Keyboard navigation
// ---------------------------------------------------------------------------
describe('SearchableDropdown — keyboard navigation', () => {
  it('ArrowDown moves focus to the first option (aria-activedescendant set)', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    await user.keyboard('{ArrowDown}')
    // react-select tracks keyboard focus via aria-activedescendant on the input
    const activeId = input.getAttribute('aria-activedescendant')
    expect(activeId).toBeTruthy()
    expect(document.getElementById(activeId)).toBeInTheDocument()
  })

  it('ArrowDown twice moves focus to a different option', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    await user.keyboard('{ArrowDown}')
    const firstActiveId = input.getAttribute('aria-activedescendant')
    await user.keyboard('{ArrowDown}')
    const secondActiveId = input.getAttribute('aria-activedescendant')
    expect(secondActiveId).not.toBe(firstActiveId)
  })

  it('ArrowUp from the first option wraps focus to a different option', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    await user.keyboard('{ArrowDown}')
    const firstId = input.getAttribute('aria-activedescendant')
    await user.keyboard('{ArrowUp}')
    const wrappedId = input.getAttribute('aria-activedescendant')
    expect(wrappedId).not.toBe(firstId)
  })

  it('Enter selects the keyboard-focused option and calls onChange', async () => {
    const { user, onChange } = setup()
    await user.click(screen.getByRole('combobox'))
    await user.keyboard('{ArrowDown}{Enter}')
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('Enter on a highlighted option closes the listbox', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('combobox'))
    await user.keyboard('{ArrowDown}{Enter}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('Escape closes the listbox without selecting', async () => {
    const { user, onChange } = setup()
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('ArrowDown within filtered results and Enter selects the correct option', async () => {
    const { user, onChange } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'GRMN' } })
    // Only 1 result; ArrowDown + Enter should select GRMN
    await user.keyboard('{ArrowDown}{Enter}')
    expect(onChange).toHaveBeenCalledWith('GRMN')
  })
})

// ---------------------------------------------------------------------------
// 10. Edge cases — null / undefined fields in data
// ---------------------------------------------------------------------------
// TickerDropdown.jsx computes `sorted`/`options` at module scope, so changing
// the mock data at runtime has no effect. These tests are documented as todos
// and require the implementation to guard nulls at the sort + filterOption level.
// To run them, a separate test file using vi.resetModules() + vi.doMock() per
// test is needed; they are left as todos to track the requirement without
// risking test suite hangs caused by re-importing heavy dependencies.
describe('SearchableDropdown — null/undefined data fields', () => {
  it.todo('does not crash when data contains a null Ticket (needs vi.resetModules() harness)')
  it.todo('does not crash when data contains a null Company (needs vi.resetModules() harness)')
  it.todo('does not crash when both Ticket and Company are undefined')
  it.todo('null-Ticket entries do not trigger onChange(null) on selection')
  it.todo('still shows valid entries alongside null-field entries')
})

// ---------------------------------------------------------------------------
// 11. Special characters in search input
// ---------------------------------------------------------------------------
describe('SearchableDropdown — special characters in search', () => {
  it('"&" in query matches "Abercrombie & Fitch Co."', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    // Use fireEvent for special-char strings to avoid userEvent keymap edge cases
    fireEvent.change(input, { target: { value: '& Fitch' } })
    expect(screen.getByRole('option', { name: /ANF/i })).toBeInTheDocument()
  })

  it('"." in query matches "BA.C"', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'BA.' } })
    expect(screen.getByRole('option', { name: /Bank of America/i })).toBeInTheDocument()
  })

  it('query with only spaces does not crash', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: '   ' } })
    expect(screen.queryByRole('combobox')).toBeInTheDocument()
  })

  it('query with SQL-injection-like string does not crash', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: "'; DROP TABLE--" } })
    expect(screen.queryByRole('combobox')).toBeInTheDocument()
  })

  it('very long query string (200+ chars) does not crash', async () => {
    const { user } = setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    // Use fireEvent to avoid userEvent simulating 200 individual keystrokes
    fireEvent.change(input, { target: { value: 'A'.repeat(200) } })
    expect(screen.queryByRole('combobox')).toBeInTheDocument()
  })
})
