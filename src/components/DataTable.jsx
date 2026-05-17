import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
} from '@chakra-ui/react'

export default function DataTable({ data }) {
  const formatPrice = (val) => {
    if (val === null || val === undefined) return '—'
    return Number(val).toFixed(2)
  }

  const sorted = data ? [...data].sort((a, b) => new Date(a.date) - new Date(b.date)) : []

  return (
    <>
      {sorted.length > 0 && (
        <Text fontSize="sm" color="text.secondary" mb={3}>
          Showing {sorted.length} records
        </Text>
      )}
      <TableContainer>
        <Table variant="cedear" size="sm">
          <Thead>
            <Tr>
              <Th>Fecha</Th>
              <Th>Apertura</Th>
              <Th>Máximo</Th>
              <Th>Mínimo</Th>
              <Th>Cierre</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sorted.length === 0 ? (
              <Tr>
                <Td colSpan={5} textAlign="center" color="text.secondary" fontStyle="italic" py={8}>
                  No data available for the selected period.
                </Td>
              </Tr>
            ) : (
              sorted.map((row) => (
                <Tr key={row.date}>
                  <Td>{row.date}</Td>
                  <Td>{formatPrice(row.o)}</Td>
                  <Td>{formatPrice(row.h)}</Td>
                  <Td>{formatPrice(row.l)}</Td>
                  <Td>{formatPrice(row.c)}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}

