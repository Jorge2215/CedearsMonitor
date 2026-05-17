import { useState } from 'react'
import './App.css'
import TickerDropdown from './components/TickerDropdown'
import DateRangePicker from './components/DateRangePicker'
import DataTable from './components/DataTable'
import PriceChart from './components/PriceChart'
import { useCedearData } from './hooks/useCedearData'

function App() {
  const currentYear = new Date().getFullYear()
  const [ticker, setTicker] = useState('')
  const [dateFrom, setDateFrom] = useState(new Date(currentYear, 0, 1))
  const [dateTo, setDateTo] = useState(new Date())
  const { data, loading, error, fetchData } = useCedearData()

  const handleConsultar = () => {
    if (ticker) {
      fetchData(ticker, dateFrom, dateTo)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Cedears Monitor</h1>
        <p className="app-subtitle">Historical price data for Argentine CEDEARs</p>
      </header>

      <section className="app-controls">
        <TickerDropdown value={ticker} onChange={setTicker} />
        <DateRangePicker
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
        />
        <button
          className="btn-consultar"
          onClick={handleConsultar}
          disabled={!ticker || loading}
        >
          {loading ? 'Loading...' : 'Consultar'}
        </button>
      </section>

      {error && <div className="app-error">{error}</div>}

      {data.length > 0 && (
        <section className="app-results">
          <PriceChart data={data} ticker={ticker} />
          <DataTable data={data} />
        </section>
      )}
    </div>
  )
}

export default App
