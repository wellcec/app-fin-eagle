import React from 'react'
import { InputAdornment, OutlinedInput } from '@mui/material'

const InputSufix = ({ ...rest }): React.JSX.Element => (
  <OutlinedInput
    fullWidth
    size="small"
    {...rest}
    endAdornment={<InputAdornment position="end">{rest?.text || ''}</InputAdornment>}
  />
)

export default InputSufix
