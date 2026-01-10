import * as React from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import 'dayjs/locale/pt-br'
import { Icon } from '../icons'

const IconCalendar = () => <Icon name="calendar" />

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
