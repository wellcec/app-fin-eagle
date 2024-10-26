import { Chip } from '@mui/material'
import React from 'react'

const COLOR_SIZE = 33

interface IProps {
  label?: string
  color?: string
  size?: number
}

const BallColor = ({ color, size, label }: IProps): React.JSX.Element => (
  <Chip
    label={label}
    variant="filled"
    style={{
      color: 'white',
      width: size ?? COLOR_SIZE,
      height: size ?? COLOR_SIZE,
      backgroundColor: color
    }}
  />
)

export default BallColor
