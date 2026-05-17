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
      borderColor="gray.100"
      borderRadius="lg"
      p={3}
      boxShadow="lg"
      lineHeight="1.7"
    >
      <Text fontSize="xs" color="gray.500" mb={1}>{label}</Text>
      <Text fontWeight="700" color="#06B6D4" fontSize="lg">
        ${d?.c != null ? d.c.toFixed(2) : '—'}
      </Text>
      <Text fontSize="xs" color="gray.400">
        O: {d?.o != null ? d.o.toFixed(2) : '—'} &nbsp;
        H: {d?.h != null ? d.h.toFixed(2) : '—'} &nbsp;
        L: {d?.l != null ? d.l.toFixed(2) : '—'}
      </Text>
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
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={chartData} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
        <defs>
          <linearGradient id="turquoiseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#06B6D4" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: '#64748B', fontFamily: 'Poppins' }}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={(v) => v.toFixed(2)}
          tick={{ fontSize: 12, fill: '#64748B', fontFamily: 'Poppins' }}
          domain={['auto', 'auto']}
          width={70}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="c"
          name="Close"
          stroke="#06B6D4"
          strokeWidth={2.5}
          fill="url(#turquoiseGradient)"
          animationDuration={800}
          dot={false}
          activeDot={{ r: 5, fill: '#06B6D4' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

