import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchHistoricalData } from '../cedearService'

describe('fetchHistoricalData', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches data for a valid ticker', async () => {
    const mockData = [
      { date: '2024-01-02', o: 1000, h: 1050, l: 990, c: 1030 },
      { date: '2024-01-03', o: 1030, h: 1080, l: 1020, c: 1060 },
    ]
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    })

    const result = await fetchHistoricalData('MSFT')
    expect(result).toEqual(mockData)
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/historical/cedears/MSFT')
    )
  })

  it('throws on non-ok HTTP response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })
    await expect(fetchHistoricalData('BADTICKER')).rejects.toThrow()
  })

  it('throws on network failure', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))
    await expect(fetchHistoricalData('MSFT')).rejects.toThrow('Network error')
  })

  it('handles empty data array', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    })
    const result = await fetchHistoricalData('MSFT')
    expect(result).toEqual([])
  })

  it('handles records with zero or null values (financial edge case)', async () => {
    const mockData = [
      { date: '2024-01-02', o: 0, h: 0, l: 0, c: 0 },
      { date: '2024-01-03', o: null, h: null, l: null, c: null },
    ]
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    })
    const result = await fetchHistoricalData('MSFT')
    expect(result).toHaveLength(2)
  })
})
