# Skill: Browser-Side Data Export (CSV + Excel)

**Domain:** Frontend / Data Export  
**Stack:** React, Chakra UI, SheetJS (xlsx), date-fns  
**First used:** CedearMonitor — ExportButton component (2026-05-17)

---

## Pattern Overview

Export tabular data directly from the browser with zero server involvement. Two formats: CSV (native Blob API) and Excel `.xlsx` (SheetJS).

---

## Component Signature

```jsx
<ExportButton data={data} ticker={ticker} loading={loading} />
```

| Prop | Type | Description |
|------|------|-------------|
| `data` | `Array<object>` | Rows to export. Each object's keys become column headers. |
| `ticker` | `string` | Used in the file name: `Cedear_<ticker>_<date>.ext` |
| `loading` | `boolean` | Disables buttons while data is being fetched. |

---

## CSV Export (no dependencies)

```js
function exportCSV(rows, fileName) {
  const header = Object.keys(rows[0]).join(',')
  const lines = rows.map(r => Object.values(r).join(','))
  const csv = [header, ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
```

**Note:** `document.body.appendChild/removeChild` is required for Firefox compatibility.

---

## Excel Export (SheetJS)

Install: `npm install xlsx`

```js
import * as XLSX from 'xlsx'

function exportExcel(rows, sheetName, fileName) {
  const ws = XLSX.utils.json_to_sheet(rows)

  // Column widths
  ws['!cols'] = Object.keys(rows[0]).map(() => ({ wch: 14 }))

  // Header styles (best-effort — renders in Excel/LibreOffice)
  Object.keys(rows[0]).forEach((_, colIdx) => {
    const ref = XLSX.utils.encode_cell({ r: 0, c: colIdx })
    if (ws[ref]) ws[ref].s = { font: { bold: true }, fill: { fgColor: { rgb: 'D6EAF8' } } }
  })

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  XLSX.writeFile(wb, fileName)
}
```

**Note:** SheetJS community edition does not guarantee full CSS-style rendering in all environments, but bold + fill are honored by major spreadsheet apps.

---

## File Naming

```js
import { format } from 'date-fns'

function getFileName(ticker, ext) {
  return `Cedear_${ticker}_${format(new Date(), 'yyyy-MM-dd')}.${ext}`
}
```

---

## User Feedback (Chakra UI)

```js
const toast = useToast()

// Success
toast({ title: 'Data exported successfully', status: 'success', duration: 3000, isClosable: true })

// Empty data warning
toast({ title: 'No data available to export', status: 'warning', duration: 3000, isClosable: true })

// Error
toast({ title: 'Export failed', description: err.message, status: 'error', duration: 4000, isClosable: true })
```

---

## Edge Cases

| Situation | Behavior |
|-----------|----------|
| `data` is empty or null | Buttons disabled; if clicked, shows "No data available" toast |
| `loading` is true | Buttons disabled |
| Export throws | Error toast with `err.message` |

---

## Data Transformation Helper

```js
// Transform OHLC records for export
function buildRows(data) {
  return data.map(row => ({
    Date: row.date,
    Open: row.o ?? '',
    High: row.h ?? '',
    Low: row.l ?? '',
    Close: row.c ?? '',
  }))
}
```

Adapt `buildRows` to your actual data shape. Keys become column headers in both CSV and Excel.
