import { useState } from 'react'
import {
  Box,
  Container,
  Flex,
  VStack,
  Heading,
  Text,
  Button,
  Alert,
  AlertIcon,
  Spinner,
  Card,
  CardBody,
} from '@chakra-ui/react'
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
    <Box bg="bg.page" minH="100vh" py={8}>
      <Container maxW="1200px" px={{ base: 3, md: 6 }}>
        {/* Header */}
        <VStack spacing={1} mb={8} textAlign="center">
          <Heading as="h1" size="xl" fontWeight={700} color="text.primary" letterSpacing="-0.025em">
            Cedears Monitor
          </Heading>
          <Text color="text.secondary" fontSize="md">
            Historical price data for Argentine CEDEARs
          </Text>
        </VStack>

        {/* Controls */}
        <Card bg="bg.surface" boxShadow="card" borderRadius="lg" mb={6}>
          <CardBody>
            <Flex wrap="wrap" align="flex-end" gap={4}>
              <TickerDropdown value={ticker} onChange={setTicker} />
              <DateRangePicker
                dateFrom={dateFrom}
                dateTo={dateTo}
                onDateFromChange={setDateFrom}
                onDateToChange={setDateTo}
              />
              <Button
                onClick={handleConsultar}
                isDisabled={!ticker || loading}
                isLoading={loading}
                loadingText="Loading..."
                colorScheme="brand"
                size="md"
                alignSelf="flex-end"
              >
                Consultar
              </Button>
            </Flex>
          </CardBody>
        </Card>

        {/* Error */}
        {error && (
          <Alert status="error" borderRadius="md" mb={6}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* Loading (full-page spinner when no data yet) */}
        {loading && data.length === 0 && (
          <Flex justify="center" py={16}>
            <Spinner size="xl" color="brand.500" thickness="4px" />
          </Flex>
        )}

        {/* Results */}
        {data.length > 0 && (
          <VStack spacing={6} align="stretch">
            <Card bg="bg.surface" boxShadow="card" borderRadius="lg">
              <CardBody>
                <Text fontSize="lg" fontWeight={600} color="text.primary" mb={4}>
                  {ticker} — Histórico de Precios
                </Text>
                <PriceChart data={data} ticker={ticker} />
              </CardBody>
            </Card>

            <Card bg="bg.surface" boxShadow="card" borderRadius="lg">
              <CardBody>
                <Text fontSize="lg" fontWeight={600} color="text.primary" mb={4}>
                  Datos OHLC
                </Text>
                <DataTable data={data} />
              </CardBody>
            </Card>
          </VStack>
        )}
      </Container>
    </Box>
  )
}

export default App

