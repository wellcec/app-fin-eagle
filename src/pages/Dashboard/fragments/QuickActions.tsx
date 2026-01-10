import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import Paper from '~/components/layout/Paper'
import { useNavigate } from 'react-router-dom'
import colors from '~/layout/theme/colors'
import { Icon } from '~/components/atoms/icons'

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

          <Box display="flex" alignItems="center" gap={1}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              startIcon={
                <Box display="flex" style={{ transform: 'rotate(180deg)' }}>
                  <Icon name="transaction" color={colors.background.main} size={20} />
                </Box>
              }
              onClick={() => { handleNavigate('Receita') }}
            >
              Receber
            </Button>

            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={<Icon name="transaction" color={colors.background.main} size={20} />}
              onClick={() => { handleNavigate('Despesa') }}
            >
              Gastar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default QuickActions
