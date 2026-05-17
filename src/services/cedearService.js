/**
 * cedearService — fetches historical price data for a CEDEAR ticker
 *
 * API: https://data912.com/historical/cedears/{ticker}
 * Response: Array<{date: string, o: number, h: number, l: number, c: number}>
 */

const API_BASE_URL = 'https://data912.com'

/**
 * Fetches historical OHLC price data for a CEDEAR ticker.
 * @param {string} ticker - The CEDEAR ticker symbol (e.g., 'MSFT')
 * @returns {Promise<Array<{date: string, o: number, h: number, l: number, c: number}>>}
 * @throws {Error} When the ticker is invalid, the network fails, or the API returns an error
 */
export async function fetchHistoricalData(ticker) {
  if (!ticker || typeof ticker !== 'string' || ticker.trim() === '') {
    throw new Error('Ticker must be a non-empty string')
  }

  const cleanTicker = ticker.trim().toUpperCase()
  const url = `${API_BASE_URL}/historical/cedears/${encodeURIComponent(cleanTicker)}`

  let response
  try {
    response = await fetch(url)
  } catch (networkError) {
    throw new Error(`Network error fetching data for ${cleanTicker}: ${networkError.message}`)
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch data for ${cleanTicker}: ${response.status} ${response.statusText}`
    )
  }

  const data = await response.json()
  return data
}
