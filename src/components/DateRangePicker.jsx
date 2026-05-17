import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function DateRangePicker({ dateFrom, dateTo, onDateFromChange, onDateToChange }) {
  return (
    <div className="date-range-picker">
      <div className="date-field">
        <label>From</label>
        <DatePicker
          selected={dateFrom}
          onChange={onDateFromChange}
          selectsStart
          startDate={dateFrom}
          endDate={dateTo}
          maxDate={dateTo}
          dateFormat="dd/MM/yyyy"
        />
      </div>
      <div className="date-field">
        <label>To</label>
        <DatePicker
          selected={dateTo}
          onChange={onDateToChange}
          selectsEnd
          startDate={dateFrom}
          endDate={dateTo}
          minDate={dateFrom}
          maxDate={new Date()}
          dateFormat="dd/MM/yyyy"
        />
      </div>
    </div>
  )
}
