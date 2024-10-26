import React from 'react'
import { TextField } from '@mui/material'

const InputText = ({ ...rest }): React.JSX.Element => (
  <TextField
    fullWidth
    variant="outlined"
    size="small"
    {...rest}
  />
)

export default InputText
