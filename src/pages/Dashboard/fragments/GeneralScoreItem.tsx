import { Box, Typography } from '@mui/material'
import React from 'react'
import Paper from '~/components/layout/Paper'
import useUtils from '~/shared/hooks/useUtils'

interface IProps {
  label: string
  value: number
  color: string
  icon: React.JSX.Element
}

const GeneralScoreItem = ({ value, label, color, icon }: IProps) => {
  const { formatCurrencyString } = useUtils()

  return (
    <Paper>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="subtitle1" fontWeight={500}>
            {label}
          </Typography>

          <Box>
            {icon}
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" component="div" color={color}>
            {formatCurrencyString(value)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export default GeneralScoreItem