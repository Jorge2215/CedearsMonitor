/**
 * ExportButton test suite — May / QA
 *
 * Tests the Data Export feature: CSV and Excel download, disabled states,
 * toast feedback, and edge cases.
 *
 * NOTE: The current implementation exports Date, Open, High, Low, Close
 * (full OHLC). The original spec called for Date, Close, Volume — that
 * divergence is flagged in edge-case tests below.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test-utils'
import ExportButton from '../ExportButton'

// ---------------------------------------------------------------------------
// xlsx mock — must be hoisted so vi.mock factory can reference the functions
// ---------------------------------------------------------------------------
const xlsxMocks = vi.hoisted(() => ({
  jsonToSheet: vi.fn(() => ({ '!ref': 'A1:C4' })),
  encodeCell: vi.fn(({ r, c }) => `${String.fromCharCode(65 + c)}${r + 1}`),
  bookNew: vi.fn(() => ({})),
  bookAppendSheet: vi.fn(),
  writeFile: vi.fn(),
}))

vi.mock('xlsx', () => ({
  default: {
    utils: {
      json_to_sheet: xlsxMocks.jsonToSheet,
      encode_cell: xlsxMocks.encodeCell,
      book_new: xlsxMocks.bookNew,
      book_append_sheet: xlsxMocks.bookAppendSheet,
    },
    writeFile: xlsxMocks.writeFile,
  },
  utils: {
    json_to_sheet: xlsxMocks.jsonToSheet,
    encode_cell: xlsxMocks.encodeCell,
    book_new: xlsxMocks.bookNew,
    book_append_sheet: xlsxMocks.bookAppendSheet,
  },
  writeFile: xlsxMocks.writeFile,
}))

// ---------------------------------------------------------------------------
// Chakra useToast partial mock — preserves all real Chakra components
// ---------------------------------------------------------------------------
const toastMocks = vi.hoisted(() => ({ fn: vi.fn() }))

vi.mock('@chakra-ui/react', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useToast: () => toastMocks.fn }
})

// ---------------------------------------------------------------------------
// Helper: read a Blob as text (jsdom's Blob does not expose .text())
// ---------------------------------------------------------------------------
function readBlobText(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsText(blob)
  })
}

// ---------------------------------------------------------------------------
// Sample data — full OHLC so buildRows produces all five columns
// ---------------------------------------------------------------------------
const SAMPLE_DATA = [
  { date: '2026-01-02', o: 1490.00, h: 1520.00, l: 1480.00, c: 1500.00, v: 120000 },
  { date: '2026-01-03', o: 1500.00, h: 1540.00, l: 1495.00, c: 1520.50, v: 98000 },
  { date: '2026-01-04', o: 1520.50, h: 1530.00, l: 1490.00, c: 1495.75, v: 135000 },
]

// ---------------------------------------------------------------------------
// Shared test state
// ---------------------------------------------------------------------------
let createdAnchors

beforeEach(() => {
  createdAnchors = []

  global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
  global.URL.revokeObjectURL = vi.fn()

  // Intercept anchor elements to capture download attribute and suppress real navigation.
  // We capture the original before installing the spy so Chakra's portal elements
  // (tooltips, toast containers) still get real DOM nodes — only <a> clicks are suppressed.
  const originalCreate = document.createElement.bind(document)
  vi.spyOn(document, 'createElement').mockImplementation((tag, ...opts) => {
    const el = originalCreate(tag, ...opts)
    if (tag === 'a') {
      createdAnchors.push(el)
      vi.spyOn(el, 'click').mockImplementation(() => {})
    }
    return el
  })

  toastMocks.fn.mockClear()
  Object.values(xlsxMocks).forEach((fn) => fn.mockClear())
})

afterEach(() => {
  vi.restoreAllMocks()
})

// ===========================================================================
// §1 — Rendering
// ===========================================================================
describe('ExportButton — rendering', () => {
  it('renders an "Export CSV" button', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    expect(screen.getByRole('button', { name: /export csv/i })).toBeInTheDocument()
  })

  it('renders an "Export Excel" button', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    expect(screen.getByRole('button', { name: /export excel/i })).toBeInTheDocument()
  })

  it('renders both export buttons in the same component', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })
})

// ===========================================================================
// §2 — Disabled states
// ===========================================================================
describe('ExportButton — disabled states', () => {
  it('CSV button is disabled when data is null', () => {
    render(<ExportButton data={null} ticker="AAPL" loading={false} />)
    expect(screen.getByRole('button', { name: /export csv/i })).toBeDisabled()
  })

  it('Excel button is disabled when data is null', () => {
    render(<ExportButton data={null} ticker="AAPL" loading={false} />)
    expect(screen.getByRole('button', { name: /export excel/i })).toBeDisabled()
  })

  it('CSV button is disabled when data is an empty array', () => {
    render(<ExportButton data={[]} ticker="AAPL" loading={false} />)
    expect(screen.getByRole('button', { name: /export csv/i })).toBeDisabled()
  })

  it('Excel button is disabled when data is an empty array', () => {
    render(<ExportButton data={[]} ticker="AAPL" loading={false} />)
    expect(screen.getByRole('button', { name: /export excel/i })).toBeDisabled()
  })

  it('CSV button is disabled during loading', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={true} />)
    expect(screen.getByRole('button', { name: /export csv/i })).toBeDisabled()
  })

  it('Excel button is disabled during loading', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={true} />)
    expect(screen.getByRole('button', { name: /export excel/i })).toBeDisabled()
  })

  it('CSV button is enabled when data is present and not loading', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    expect(screen.getByRole('button', { name: /export csv/i })).not.toBeDisabled()
  })

  it('Excel button is enabled when data is present and not loading', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    expect(screen.getByRole('button', { name: /export excel/i })).not.toBeDisabled()
  })
})

// ===========================================================================
// §3 — CSV export mechanics
// ===========================================================================
describe('ExportButton — CSV export', () => {
  it('clicking Export CSV creates a blob URL', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export csv/i }))
    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob))
  })

  it('clicking Export CSV triggers an anchor click (file download)', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export csv/i }))
    expect(createdAnchors).toHaveLength(1)
    expect(createdAnchors[0].click).toHaveBeenCalled()
  })

  it('CSV filename matches Cedear_<Ticker>_<YYYY-MM-DD>.csv pattern', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export csv/i }))
    expect(createdAnchors[0].download).toMatch(/^Cedear_AAPL_\d{4}-\d{2}-\d{2}\.csv$/)
  })

  it('CSV filename contains the ticker symbol', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="MSFT" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export csv/i }))
    expect(createdAnchors[0].download).toContain('MSFT')
  })

  it('CSV anchor href is set to the blob URL', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export csv/i }))
    expect(createdAnchors[0].href).toBe('blob:mock-url')
  })

  it('CSV Blob has text/csv MIME type', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export csv/i }))
    const blob = URL.createObjectURL.mock.calls[0][0]
    expect(blob.type).toContain('text/csv')
  })

  it('CSV content includes header row with Date, Open, High, Low, Close columns', async () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export csv/i }))
    const blob = URL.createObjectURL.mock.calls[0][0]
    const text = await readBlobText(blob)
    const header = text.split('\n')[0]
    expect(header).toMatch(/Date/i)
    expect(header).toMatch(/Close/i)
    expect(header).toMatch(/Open/i)
  })

  it('CSV rows contain correct data values', async () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export csv/i }))
    const blob = URL.createObjectURL.mock.calls[0][0]
    const text = await readBlobText(blob)
    expect(text).toContain('2026-01-02')
    expect(text).toContain('1500')
    expect(text).toContain('1490')
  })

  it('CSV has 1 header row + 1 data row per input record', async () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export csv/i }))
    const blob = URL.createObjectURL.mock.calls[0][0]
    const text = await readBlobText(blob)
    const lines = text.trim().split('\n').filter(Boolean)
    expect(lines).toHaveLength(SAMPLE_DATA.length + 1) // header + data rows
  })

  it('revokes the blob URL after download to avoid memory leaks', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export csv/i }))
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
  })
})

// ===========================================================================
// §4 — Excel export mechanics
// ===========================================================================
describe('ExportButton — Excel export', () => {
  it('clicking Export Excel calls XLSX.utils.json_to_sheet with data rows', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export excel/i }))
    expect(xlsxMocks.jsonToSheet).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ Date: expect.any(String) }),
      ])
    )
  })

  it('Excel export passes Close values to json_to_sheet', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export excel/i }))
    const rows = xlsxMocks.jsonToSheet.mock.calls[0][0]
    expect(rows[0]).toHaveProperty('Close', 1500.00)
  })

  it('clicking Export Excel creates a workbook', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export excel/i }))
    expect(xlsxMocks.bookNew).toHaveBeenCalled()
  })

  it('clicking Export Excel appends a sheet to the workbook', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export excel/i }))
    expect(xlsxMocks.bookAppendSheet).toHaveBeenCalled()
  })

  it('sheet name is the ticker symbol', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export excel/i }))
    const [, , sheetName] = xlsxMocks.bookAppendSheet.mock.calls[0]
    expect(sheetName).toBe('AAPL')
  })

  it('calls XLSX.writeFile with the workbook', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export excel/i }))
    expect(xlsxMocks.writeFile).toHaveBeenCalledWith(expect.any(Object), expect.any(String))
  })

  it('Excel filename matches Cedear_<Ticker>_<YYYY-MM-DD>.xlsx pattern', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export excel/i }))
    const filename = xlsxMocks.writeFile.mock.calls[0][1]
    expect(filename).toMatch(/^Cedear_AAPL_\d{4}-\d{2}-\d{2}\.xlsx$/)
  })

  it('Excel filename contains the ticker symbol', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="MSFT" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export excel/i }))
    const filename = xlsxMocks.writeFile.mock.calls[0][1]
    expect(filename).toContain('MSFT')
  })

  it('Excel rows contain all three sample records', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export excel/i }))
    const rows = xlsxMocks.jsonToSheet.mock.calls[0][0]
    expect(rows).toHaveLength(SAMPLE_DATA.length)
  })
})

// ===========================================================================
// §5 — Toast feedback
// ===========================================================================
describe('ExportButton — toast feedback', () => {
  it('shows a success toast after CSV export', async () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export csv/i }))
    await waitFor(() => {
      expect(toastMocks.fn).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'success' })
      )
    })
  })

  it('CSV success toast says "Data exported successfully"', async () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export csv/i }))
    await waitFor(() => {
      const call = toastMocks.fn.mock.calls[0][0]
      expect(call.title).toMatch(/data exported successfully/i)
    })
  })

  it('shows a success toast after Excel export', async () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export excel/i }))
    await waitFor(() => {
      expect(toastMocks.fn).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'success' })
      )
    })
  })

  it('shows an error toast when CSV blob creation throws', async () => {
    URL.createObjectURL.mockImplementationOnce(() => {
      throw new Error('Blob creation failed')
    })
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export csv/i }))
    await waitFor(() => {
      expect(toastMocks.fn).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'error' })
      )
    })
  })

  it('error toast includes the error message', async () => {
    URL.createObjectURL.mockImplementationOnce(() => {
      throw new Error('Disk full')
    })
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export csv/i }))
    await waitFor(() => {
      const call = toastMocks.fn.mock.calls[0][0]
      expect(call.description).toMatch(/disk full/i)
    })
  })

  it('shows an error toast when XLSX.writeFile throws', async () => {
    xlsxMocks.writeFile.mockImplementationOnce(() => {
      throw new Error('Excel write failed')
    })
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export excel/i }))
    await waitFor(() => {
      expect(toastMocks.fn).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'error' })
      )
    })
  })

  it('error toast title says "Export failed"', async () => {
    xlsxMocks.writeFile.mockImplementationOnce(() => {
      throw new Error('Something broke')
    })
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export excel/i }))
    await waitFor(() => {
      const call = toastMocks.fn.mock.calls[0][0]
      expect(call.title).toMatch(/export failed/i)
    })
  })
})

// ===========================================================================
// §6 — Edge cases
// ===========================================================================
describe('ExportButton — edge cases', () => {
  it('exports gracefully when close price (c) is null — no crash', () => {
    const dataWithNullClose = [
      { date: '2026-01-02', o: 1490, h: 1520, l: 1480, c: null },
    ]
    render(<ExportButton data={dataWithNullClose} ticker="AAPL" loading={false} />)
    expect(() =>
      fireEvent.click(screen.getByRole('button', { name: /export csv/i }))
    ).not.toThrow()
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  it('CSV row with null close produces empty string in output, not "null"', async () => {
    const dataWithNullClose = [
      { date: '2026-01-02', o: 1490, h: 1520, l: 1480, c: null },
    ]
    render(<ExportButton data={dataWithNullClose} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export csv/i }))
    const blob = URL.createObjectURL.mock.calls[0][0]
    const text = await readBlobText(blob)
    expect(text).not.toContain('null')
  })

  it('exports gracefully when open price (o) is null — no crash', () => {
    const dataWithNullOpen = [
      { date: '2026-01-02', o: null, h: 1520, l: 1480, c: 1500 },
    ]
    render(<ExportButton data={dataWithNullOpen} ticker="AAPL" loading={false} />)
    expect(() =>
      fireEvent.click(screen.getByRole('button', { name: /export csv/i }))
    ).not.toThrow()
  })

  it('CSV row with undefined field produces empty string, not "undefined"', async () => {
    const dataWithoutFields = [
      { date: '2026-01-02' }, // all OHLC fields missing
    ]
    render(<ExportButton data={dataWithoutFields} ticker="AAPL" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export csv/i }))
    const blob = URL.createObjectURL.mock.calls[0][0]
    const text = await readBlobText(blob)
    expect(text).not.toContain('undefined')
  })

  it('handles a 1000-row dataset without crashing', () => {
    const bigData = Array.from({ length: 1000 }, (_, i) => ({
      date: `2024-01-${String((i % 28) + 1).padStart(2, '0')}`,
      o: 1000 + i * 0.5,
      h: 1050 + i * 0.5,
      l: 990 + i * 0.5,
      c: 1030 + i * 0.5,
      v: 100000 + i * 100,
    }))
    render(<ExportButton data={bigData} ticker="AAPL" loading={false} />)
    expect(() =>
      fireEvent.click(screen.getByRole('button', { name: /export csv/i }))
    ).not.toThrow()
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  it('ticker with dots (e.g. AAPL.BA) appears in the filename', () => {
    render(<ExportButton data={SAMPLE_DATA} ticker="AAPL.BA" loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /export csv/i }))
    expect(createdAnchors[0].download).toContain('AAPL.BA')
  })

  // KNOWN GAP: getFileName() does no sanitization — tickers with filesystem-unsafe
  // characters (/ \ : * ? " < > |) would produce unsafe filenames.
  it.todo('ticker with special chars (e.g. slashes) produces a safe filename')

  // SPEC DIVERGENCE: original spec required Date, Close, Volume columns.
  // Current implementation exports Date, Open, High, Low, Close (no Volume).
  // Remove this todo and update buildRows() when volume is available in API data.
  it.todo('CSV and Excel include a Volume column when API data provides v field')
})
