import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FormControl, FormLabel, HStack } from '@chakra-ui/react'

export default function DateRangePicker({ dateFrom, dateTo, onDateFromChange, onDateToChange }) {
  return (
    <HStack spacing={3} wrap="wrap">
      <FormControl w="auto">
        <FormLabel
          fontSize="sm"
          fontWeight={600}
          color="text.secondary"
          textTransform="uppercase"
          letterSpacing="0.04em"
          mb={1}
        >
          From
        </FormLabel>
        <DatePicker
          selected={dateFrom}
          onChange={onDateFromChange}
          selectsStart
          startDate={dateFrom}
          endDate={dateTo}
          maxDate={dateTo}
          dateFormat="dd/MM/yyyy"
        />
      </FormControl>
      <FormControl w="auto">
        <FormLabel
          fontSize="sm"
          fontWeight={600}
          color="text.secondary"
          textTransform="uppercase"
          letterSpacing="0.04em"
          mb={1}
        >
          To
        </FormLabel>
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
      </FormControl>
    </HStack>
  )
}

