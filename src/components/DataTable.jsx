export default function DataTable({ data }) {
  const formatPrice = (val) => {
    if (val === null || val === undefined) return '—'
    return Number(val).toFixed(2)
  }

  const sorted = data ? [...data].sort((a, b) => new Date(a.date) - new Date(b.date)) : []

  return (
    <div className="data-table-container">
      {sorted.length > 0 && (
        <p className="results-count">Showing {sorted.length} records</p>
      )}
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Open</th>
              <th>High</th>
              <th>Low</th>
              <th>Close</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={5} className="no-data">No data available for the selected period.</td>
              </tr>
            ) : (
              sorted.map((row, i) => (
                <tr key={row.date} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
                  <td>{row.date}</td>
                  <td>{formatPrice(row.o)}</td>
                  <td>{formatPrice(row.h)}</td>
                  <td>{formatPrice(row.l)}</td>
                  <td>{formatPrice(row.c)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
