import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PriceChart from '../PriceChart'

// Recharts uses ResizeObserver — mock it for jsdom
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

const mockData = [
  { date: '2024-01-02', o: 1000, h: 1050, l: 990, c: 1030 },
  { date: '2024-01-03', o: 1030, h: 1080, l: 1020, c: 1060 },
]

describe('PriceChart', () => {
  it('renders without crashing', () => {
    render(<PriceChart data={mockData} ticker="MSFT" />)
    // Should not throw
  })

  it('shows the ticker name in the chart title or heading', () => {
    render(<PriceChart data={mockData} ticker="MSFT" />)
    expect(screen.getByText(/MSFT/i)).toBeInTheDocument()
  })

  it('handles empty data gracefully', () => {
    render(<PriceChart data={[]} ticker="MSFT" />)
    // Should render without crashing, may show empty state
  })

  it('handles null ticker gracefully', () => {
    render(<PriceChart data={mockData} ticker={null} />)
    // Should not crash
  })
})
