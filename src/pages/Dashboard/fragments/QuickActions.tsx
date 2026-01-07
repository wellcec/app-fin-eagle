import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import Paper from '~/components/layout/Paper'
import { IconTransaction } from '~/constants/icons'
import { useNavigate } from 'react-router-dom'

const QuickActions = (): React.JSX.Element => {
  const navigate = useNavigate()

  const handleNavigate = (segment: 'Receita' | 'Despesa'): void => {
    navigate('/transactions', { state: { openAdd: true, type: segment } })
  }

  return (
    <Box flex="auto" height={1}>
      <Paper grid>
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Typography variant="subtitle1" fontWeight={500}>
              Ações Rápidas
            </Typography>
          </Box>

          <Box display="flex" gap={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<IconTransaction size={20} />}
              onClick={() => { handleNavigate('Receita') }}
            >
              Nova Transação
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default QuickActions
