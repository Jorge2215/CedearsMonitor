import { ButtonGroup, Button, useToast } from '@chakra-ui/react'
import * as XLSX from 'xlsx'
import { format } from 'date-fns'

function buildRows(data) {
  return data.map((row) => ({
    Date: row.date,
    Open: row.o ?? '',
    High: row.h ?? '',
    Low: row.l ?? '',
    Close: row.c ?? '',
  }))
}

function getFileName(ticker, ext) {
  const today = format(new Date(), 'yyyy-MM-dd')
  return `Cedear_${ticker}_${today}.${ext}`
}

export default function ExportButton({ data, ticker, loading }) {
  const toast = useToast()
  const hasData = Array.isArray(data) && data.length > 0
  const isDisabled = loading || !hasData

  const showEmptyWarning = () => {
    toast({
      title: 'No data available to export',
      status: 'warning',
      duration: 3000,
      isClosable: true,
    })
  }

  const showSuccess = () => {
    toast({
      title: 'Data exported successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const showError = (err) => {
    toast({
      title: 'Export failed',
      description: err.message,
      status: 'error',
      duration: 4000,
      isClosable: true,
    })
  }

  const exportCSV = () => {
    try {
      if (!hasData) { showEmptyWarning(); return }

      const rows = buildRows(data)
      const header = Object.keys(rows[0]).join(',')
      const lines = rows.map((r) => Object.values(r).join(','))
      const csv = [header, ...lines].join('\n')

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = getFileName(ticker, 'csv')
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      showSuccess()
    } catch (err) {
      showError(err)
    }
  }

  const exportExcel = () => {
    try {
      if (!hasData) { showEmptyWarning(); return }

      const rows = buildRows(data)
      const ws = XLSX.utils.json_to_sheet(rows)

      // Bold the header row via cell styles (best-effort — community xlsx supports this via cell format)
      const headerKeys = Object.keys(rows[0])
      headerKeys.forEach((_, colIdx) => {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIdx })
        if (ws[cellRef]) {
          ws[cellRef].s = { font: { bold: true }, fill: { fgColor: { rgb: 'D6EAF8' } } }
        }
      })

      // Set reasonable column widths
      ws['!cols'] = headerKeys.map(() => ({ wch: 14 }))

      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, ticker || 'Data')
      XLSX.writeFile(wb, getFileName(ticker, 'xlsx'))

      showSuccess()
    } catch (err) {
      showError(err)
    }
  }

  return (
    <ButtonGroup size="sm" variant="outline" spacing={2}>
      <Button
        onClick={exportCSV}
        isDisabled={isDisabled}
        colorScheme="teal"
        leftIcon={<span aria-hidden="true">📄</span>}
        title={isDisabled && !loading ? 'No data to export' : 'Export as CSV'}
      >
        Export CSV
      </Button>
      <Button
        onClick={exportExcel}
        isDisabled={isDisabled}
        colorScheme="teal"
        leftIcon={<span aria-hidden="true">📊</span>}
        title={isDisabled && !loading ? 'No data to export' : 'Export as Excel'}
      >
        Export Excel
      </Button>
    </ButtonGroup>
  )
}
