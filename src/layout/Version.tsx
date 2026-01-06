import React from 'react'
import { Typography } from '@mui/material'
import pkg from '../../package.json'
import colors from './theme/colors'

const Version = (): React.JSX.Element => (
  <Typography variant="body2" color={colors.primary.main}>
    Granna v{pkg.version}
  </Typography>
)

export default Version