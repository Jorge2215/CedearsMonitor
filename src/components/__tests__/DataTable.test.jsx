import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DataTable from '../DataTable'

const mockData = [
  { date: '2024-01-02', o: 1000.50, h: 1050.75, l: 990.25, c: 1030.00 },
  { date: '2024-01-03', o: 1030.00, h: 1080.00, l: 1020.50, c: 1060.50 },
]

describe('DataTable', () => {
  it('renders table headers: Date, Open, High, Low, Close', () => {
    render(<DataTable data={mockData} />)
    expect(screen.getByText(/date/i)).toBeInTheDocument()
    expect(screen.getByText(/open/i)).toBeInTheDocument()
    expect(screen.getByText(/high/i)).toBeInTheDocument()
    expect(screen.getByText(/low/i)).toBeInTheDocument()
    expect(screen.getByText(/close/i)).toBeInTheDocument()
  })

  it('renders a row for each data item', () => {
    render(<DataTable data={mockData} />)
    const rows = screen.getAllByRole('row')
    // 1 header row + 2 data rows
    expect(rows).toHaveLength(3)
  })

  it('shows the date values', () => {
    render(<DataTable data={mockData} />)
    expect(screen.getByText('2024-01-02')).toBeInTheDocument()
    expect(screen.getByText('2024-01-03')).toBeInTheDocument()
  })

  it('renders empty state gracefully when data is empty', () => {
    render(<DataTable data={[]} />)
    // Should not crash — table renders with header row + no-data message row
    expect(screen.getAllByRole('row').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/no data available/i)).toBeInTheDocument()
  })

  it('handles records with null/zero price values', () => {
    const nullData = [{ date: '2024-01-02', o: 0, h: null, l: 0, c: null }]
    render(<DataTable data={nullData} />)
    // Should render without crashing
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('renders a large dataset without crashing', () => {
    const bigData = Array.from({ length: 365 }, (_, i) => ({
      date: `2024-${String(Math.floor(i/30)+1).padStart(2,'0')}-${String((i%30)+1).padStart(2,'0')}`,
      o: 1000 + i, h: 1050 + i, l: 990 + i, c: 1030 + i,
    }))
    render(<DataTable data={bigData} />)
    expect(screen.getByRole('table')).toBeInTheDocument()
  })
})
