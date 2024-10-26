import * as React from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import 'dayjs/locale/pt-br'
import { IconCalendar } from '~/constants/icons'

const InputBasicDate = ({ ...rest }): React.JSX.Element => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <DatePicker
        closeOnSelect
        {...rest}
        format='DD/MM/YYYY'
        slots={{
          openPickerIcon: IconCalendar
        }}
        slotProps={{
          textField: {
            size: 'small',
            variant: 'outlined'
          }
        }}
      />
    </LocalizationProvider>
  )
}

export default InputBasicDate
