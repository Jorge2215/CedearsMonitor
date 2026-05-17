import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test-utils'
import App from '../../App'

// Mock the data services
vi.mock('../../hooks/useCedearData', () => ({
  useCedearData: () => ({
    data: [],
    loading: false,
    error: null,
    fetchData: vi.fn(),
  }),
}))

vi.mock('../../data/CedearsList.json', () => ({
  default: [
    { Ticket: 'MSFT', Company: 'Microsoft Corporation' },
    { Ticket: 'AAPL', Company: 'Apple Inc.' },
  ]
}))

// Stub the CEDEAR selector regardless of whether it is TickerDropdown (static
// <select>) or SearchableDropdown (combobox input). Tests below interact with
// App behaviour, not dropdown internals.
vi.mock('../TickerDropdown', () => ({
  default: ({ onChange }) => (
    <button type="button" onClick={() => onChange('MSFT')}>
      Select MSFT
    </button>
  ),
}))

global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

describe('App', () => {
  it('renders the app title "Cedears Monitor"', () => {
    render(<App />)
    expect(screen.getByText(/Cedears Monitor/i)).toBeInTheDocument()
  })

  it('renders the Consultar button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /consultar/i })).toBeInTheDocument()
  })

  it('Consultar button is disabled when no ticker is selected', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: /consultar/i })
    expect(button).toBeDisabled()
  })

  it('Consultar button is enabled after selecting a ticker', async () => {
    render(<App />)
    // Trigger the stubbed dropdown's onChange to simulate a ticker selection
    fireEvent.click(screen.getByRole('button', { name: /Select MSFT/i }))
    const button = screen.getByRole('button', { name: /consultar/i })
    await waitFor(() => expect(button).not.toBeDisabled())
  })

  it('does not show results section before first query', () => {
    render(<App />)
    // No chart or table visible on initial render
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
