import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test-utils'
import userEvent from '@testing-library/user-event'
import TickerDropdown from '../TickerDropdown'

vi.mock('../../data/CedearsList.json', () => ({
  default: [
    { Ticket: 'MSFT', Company: 'Microsoft Corporation' },
    { Ticket: 'AAPL', Company: 'Apple Inc.' },
    { Ticket: 'GOOGL', Company: 'Alphabet Inc.' },
  ],
}))

describe('TickerDropdown', () => {
  it('renders a combobox input', () => {
    render(<TickerDropdown value="" onChange={vi.fn()} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('shows options matching tickers from CedearsList after opening', async () => {
    const user = userEvent.setup()
    render(<TickerDropdown value="" onChange={vi.fn()} />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('option', { name: /Microsoft/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Apple/i })).toBeInTheDocument()
  })

  it('shows placeholder text when no value is selected', () => {
    render(<TickerDropdown value="" onChange={vi.fn()} />)
    // react-select renders placeholder as a styled div, not input[placeholder]
    expect(screen.getByText(/Search CEDEAR by name or ticker/i)).toBeInTheDocument()
  })

  it('calls onChange when an option is clicked', async () => {
    const user = userEvent.setup()
    const onChangeMock = vi.fn()
    render(<TickerDropdown value="" onChange={onChangeMock} />)
    const input = screen.getByRole('combobox')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'Microsoft' } })
    await user.click(screen.getByRole('option', { name: /MSFT/i }))
    expect(onChangeMock).toHaveBeenCalledWith('MSFT')
  })

  it('reflects the current value prop as visible label text', () => {
    render(<TickerDropdown value="AAPL" onChange={vi.fn()} />)
    // react-select shows selected item in a singleValue div, not input.value
    expect(screen.getByText(/Apple Inc\./i)).toBeInTheDocument()
  })
})
