import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  const d = payload[0]?.payload
  return (
    <div className="chart-tooltip">
      <p className="tooltip-date">{label}</p>
      <p>Close: <strong>{d?.c != null ? d.c.toFixed(2) : '—'}</strong></p>
      <p>Open: {d?.o != null ? d.o.toFixed(2) : '—'}</p>
      <p>High: {d?.h != null ? d.h.toFixed(2) : '—'}</p>
      <p>Low: {d?.l != null ? d.l.toFixed(2) : '—'}</p>
    </div>
  )
}

export default function PriceChart({ data, ticker }) {
  const chartData = (data || []).filter((d) => d.c !== null && d.c !== undefined)

  return (
    <div className="price-chart">
      <h2 className="chart-title">
        {ticker ? `${ticker} — Price History` : 'Price History'}
      </h2>
      {chartData.length === 0 ? (
        <p className="no-data">No chart data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={(v) => v.toFixed(2)}
              tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
              domain={['auto', 'auto']}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="c"
              name="Close"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
