import { useState, useCallback } from 'react'
import { fetchHistoricalData } from '../services/cedearService'

/**
 * useCedearData — React hook for fetching and filtering CEDEAR historical price data.
 *
 * @returns {{
 *   data: Array<{date: string, o: number, h: number, l: number, c: number}>,
 *   loading: boolean,
 *   error: string | null,
 *   fetchData: (ticker: string, dateFrom: Date, dateTo: Date) => Promise<void>
 * }}
 */
export function useCedearData() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async (ticker, dateFrom, dateTo) => {
    setLoading(true)
    setError(null)

    try {
      const rawData = await fetchHistoricalData(ticker)

      const from = dateFrom instanceof Date ? dateFrom : new Date(dateFrom)
      const to = dateTo instanceof Date ? dateTo : new Date(dateTo)

      // Normalize to midnight for day-granularity comparison (inclusive both ends)
      const fromMs = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime()
      const toMs = new Date(to.getFullYear(), to.getMonth(), to.getDate()).getTime()

      const filtered = rawData.filter((record) => {
        const d = new Date(record.date)
        const recordMs = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
        return recordMs >= fromMs && recordMs <= toMs
      })

      setData(filtered)
    } catch (err) {
      setError(err.message || 'Failed to fetch data. Please try again.')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, fetchData }
}
