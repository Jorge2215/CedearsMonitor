import { FormControl, FormLabel, Select } from '@chakra-ui/react'
import cedearsData from '../data/CedearsList.json'

export default function TickerDropdown({ value, onChange }) {
  const sorted = [...cedearsData].sort((a, b) => a.Company.localeCompare(b.Company))

  return (
    <FormControl minW="280px" flex="1">
      <FormLabel
        fontSize="sm"
        fontWeight={600}
        color="text.secondary"
        textTransform="uppercase"
        letterSpacing="0.04em"
        mb={1}
      >
        CEDEAR
      </FormLabel>
      <Select
        id="ticker-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Select a CEDEAR..."
        size="md"
      >
        {sorted.map(({ Ticket, Company }) => (
          <option key={Ticket} value={Ticket}>
            {Company} ({Ticket})
          </option>
        ))}
      </Select>
    </FormControl>
  )
}

