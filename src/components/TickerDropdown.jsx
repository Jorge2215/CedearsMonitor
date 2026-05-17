import cedearsData from '../data/CedearsList.json'

export default function TickerDropdown({ value, onChange }) {
  const sorted = [...cedearsData].sort((a, b) => a.Company.localeCompare(b.Company))

  return (
    <div className="ticker-dropdown">
      <label htmlFor="ticker-select">CEDEAR</label>
      <select
        id="ticker-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select a CEDEAR...</option>
        {sorted.map(({ Ticket, Company }) => (
          <option key={Ticket} value={Ticket}>
            {Company} ({Ticket})
          </option>
        ))}
      </select>
    </div>
  )
}
