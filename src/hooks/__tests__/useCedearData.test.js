import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCedearData } from '../useCedearData'
import * as cedearService from '../../services/cedearService'

vi.mock('../../services/cedearService')

describe('useCedearData', () => {
  const mockData = [
    { date: '2024-01-02', o: 1000, h: 1050, l: 990, c: 1030 },
    { date: '2024-01-15', o: 1050, h: 1100, l: 1040, c: 1080 },
    { date: '2024-03-10', o: 1080, h: 1120, l: 1070, c: 1100 },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts with empty state', () => {
    const { result } = renderHook(() => useCedearData())
    expect(result.current.data).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('sets loading=true while fetching', async () => {
    let resolvePromise
    cedearService.fetchHistoricalData.mockReturnValue(
      new Promise((res) => { resolvePromise = res })
    )
    const { result } = renderHook(() => useCedearData())
    act(() => {
      result.current.fetchData('MSFT', new Date('2024-01-01'), new Date('2024-12-31'))
    })
    expect(result.current.loading).toBe(true)
    await act(async () => { resolvePromise(mockData) })
  })

  it('filters data by date range', async () => {
    cedearService.fetchHistoricalData.mockResolvedValue(mockData)
    const { result } = renderHook(() => useCedearData())
    await act(async () => {
      await result.current.fetchData(
        'MSFT',
        new Date('2024-01-01'),
        new Date('2024-01-31')
      )
    })
    // Only Jan entries should be in the result
    result.current.data.forEach(d => {
      expect(new Date(d.date).getMonth()).toBe(0) // January = month 0
    })
  })

  it('sets error on failure', async () => {
    cedearService.fetchHistoricalData.mockRejectedValue(new Error('API down'))
    const { result } = renderHook(() => useCedearData())
    await act(async () => {
      await result.current.fetchData('MSFT', new Date('2024-01-01'), new Date('2024-12-31'))
    })
    expect(result.current.error).toBeTruthy()
    expect(result.current.loading).toBe(false)
  })

  it('clears previous error on new successful fetch', async () => {
    cedearService.fetchHistoricalData
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce(mockData)
    const { result } = renderHook(() => useCedearData())
    await act(async () => {
      await result.current.fetchData('MSFT', new Date('2024-01-01'), new Date('2024-12-31'))
    })
    expect(result.current.error).toBeTruthy()
    await act(async () => {
      await result.current.fetchData('MSFT', new Date('2024-01-01'), new Date('2024-12-31'))
    })
    expect(result.current.error).toBeNull()
    expect(result.current.data.length).toBeGreaterThan(0)
  })
})
