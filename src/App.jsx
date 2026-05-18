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
  Center,
} from '@chakra-ui/react'
import TickerDropdown from './components/TickerDropdown'
import DateRangePicker from './components/DateRangePicker'
import DataTable from './components/DataTable'
import PriceChart from './components/PriceChart'
import ExportButton from './components/ExportButton'
import WindUpBirdEasterEgg from './components/WindUpBirdEasterEgg'
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
    <Box bg="bg.page" minH="100vh">
      {/* Gradient header */}
      <Box bgGradient="linear(to-r, brand.primary, brand.primaryDark)" py={6} px={8} mb={8}>
        <Flex align="center" gap={3} maxW="1200px" mx="auto" width="100%">
          <Text fontSize="3xl" lineHeight="1">📈</Text>
          <Box>
            <Heading color="white" size="lg" fontWeight="700">Cedears Monitor</Heading>
            <Text color="whiteAlpha.800" fontSize="sm">Cotizaciones en tiempo real</Text>
          </Box>
          <WindUpBirdEasterEgg />
        </Flex>
      </Box>

      <Container maxW="1200px" px={{ base: 4, md: 8 }} pb={12}>
        <VStack spacing={6} align="stretch">
          {/* Controls */}
          <Card>
            <CardBody>
              <Flex direction={{ base: 'column', md: 'row' }} gap={4} align={{ md: 'flex-end' }}>
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
                  loadingText="Cargando..."
                  alignSelf={{ base: 'stretch', md: 'flex-end' }}
                >
                  Consultar
                </Button>
              </Flex>
            </CardBody>
          </Card>

          {/* Error */}
          {error && (
            <Alert status="error" borderRadius="xl">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {/* Loading */}
          {loading && data.length === 0 && (
            <Center py={16}>
              <VStack spacing={3}>
                <Spinner size="xl" color="brand.primary" thickness="4px" speed="0.65s" />
                <Text color="text.secondary" fontSize="sm">Cargando datos...</Text>
              </VStack>
            </Center>
          )}

          {/* Results */}
          {data.length > 0 && !loading && (
            <>
              <Card>
                <CardBody>
                  <Heading size="md" mb={4}>📈 {ticker} — Histórico de Precios</Heading>
                  <PriceChart data={data} ticker={ticker} />
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={3}>
                    <Heading size="md">📊 Datos OHLC</Heading>
                    <ExportButton data={data} ticker={ticker} loading={loading} />
                  </Flex>
                  <DataTable data={data} />
                </CardBody>
              </Card>
            </>
          )}
        </VStack>
      </Container>
    </Box>
  )
}

export default App

