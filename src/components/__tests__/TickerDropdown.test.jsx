import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TickerDropdown from '../TickerDropdown'

// Mock the CedearsList import
vi.mock('../../data/CedearsList.json', () => ({
  default: [
    { Ticket: 'MSFT', Company: 'Microsoft Corporation' },
    { Ticket: 'AAPL', Company: 'Apple Inc.' },
    { Ticket: 'GOOGL', Company: 'Alphabet Inc.' },
  ]
}))

describe('TickerDropdown', () => {
  it('renders a select element', () => {
    render(<TickerDropdown value="" onChange={vi.fn()} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('shows all tickers from CedearsList', () => {
    render(<TickerDropdown value="" onChange={vi.fn()} />)
    expect(screen.getByText(/Microsoft/i)).toBeInTheDocument()
    expect(screen.getByText(/Apple/i)).toBeInTheDocument()
  })

  it('shows a placeholder/default option', () => {
    render(<TickerDropdown value="" onChange={vi.fn()} />)
    // Should have a "Select a CEDEAR" or similar empty option
    const select = screen.getByRole('combobox')
    expect(select.value).toBe('')
  })

  it('calls onChange when selection changes', () => {
    const onChangeMock = vi.fn()
    render(<TickerDropdown value="" onChange={onChangeMock} />)
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'MSFT' } })
    expect(onChangeMock).toHaveBeenCalledWith('MSFT')
  })

  it('reflects the current value prop', () => {
    render(<TickerDropdown value="AAPL" onChange={vi.fn()} />)
    const select = screen.getByRole('combobox')
    expect(select.value).toBe('AAPL')
  })
})
