import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { Box, Text } from '@chakra-ui/react'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  const d = payload[0]?.payload
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="border.default"
      borderRadius="sm"
      p={3}
      fontSize="sm"
      boxShadow="card"
      lineHeight="1.7"
    >
      <Text fontWeight={600} mb={1} color="text.primary">{label}</Text>
      <Text color="brand.600">Close: <strong>{d?.c != null ? d.c.toFixed(2) : '—'}</strong></Text>
      <Text color="text.secondary">Open: {d?.o != null ? d.o.toFixed(2) : '—'}</Text>
      <Text color="text.secondary">High: {d?.h != null ? d.h.toFixed(2) : '—'}</Text>
      <Text color="text.secondary">Low: {d?.l != null ? d.l.toFixed(2) : '—'}</Text>
    </Box>
  )
}

export default function PriceChart({ data, ticker }) {
  const chartData = (data || []).filter((d) => d.c !== null && d.c !== undefined)

  if (chartData.length === 0) {
    return (
      <Text color="text.secondary" textAlign="center" py={8} fontStyle="italic">
        No chart data available.
      </Text>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: '#64748B' }}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={(v) => v.toFixed(2)}
          tick={{ fontSize: 12, fill: '#64748B' }}
          domain={['auto', 'auto']}
          width={70}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="c"
          name="Close"
          stroke="#3B82F6"
          strokeWidth={2}
          fill="url(#priceGradient)"
          dot={false}
          activeDot={{ r: 4, fill: '#3B82F6' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

