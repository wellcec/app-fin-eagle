import React, { useEffect, useState } from 'react'
import { Alert, AlertTitle, Box, Collapse, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

import limitsRepository from '~/client/repository/limitsRepository'
import { ExceededLimitType } from '~/client/models/limits'
import useUtils from '~/shared/hooks/useUtils'

const LimitAlerts = (): React.JSX.Element => {
  const [exceededLimits, setExceededLimits] = useState<ExceededLimitType[]>([])
  const [closedAlerts, setClosedAlerts] = useState<Set<string>>(new Set())

  const { checkExceededLimits } = limitsRepository()
  const { formatCurrencyString } = useUtils()

  useEffect(() => {
    checkExceededLimits().then(
      (response) => {
        setExceededLimits(response)
      }
    )
  }, [])

  const handleClose = (id: string): void => {
    setClosedAlerts(prev => new Set(prev).add(id))
  }

  const visibleLimits = exceededLimits.filter(limit => !closedAlerts.has(limit.id))

  if (visibleLimits.length === 0) {
    return <></>
  }

  return (
    <Box>
      {visibleLimits.map((limit) => (
        <Collapse key={limit.id} in={!closedAlerts.has(limit.id)}>
          <Box>
            <Alert
              severity={limit.percentageUsed >= 150 ? 'error' : 'warning'}
              icon={<WarningAmberIcon />}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => { handleClose(limit.id) }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              <AlertTitle>
                <strong>Limite Excedido: {limit.categoryName}</strong>
              </AlertTitle>

              <Box>
                <Typography variant="body2" fontWeight={400}>
                  Você ultrapassou o limite mensal desta categoria em{' '}
                  <strong>{formatCurrencyString(limit.overage)}</strong>
                </Typography>

                <Box mt={1} display="flex" gap={2} flexWrap="wrap">
                  <Typography variant="body2" fontWeight={400}>
                    Limite: {formatCurrencyString(limit.limitAmount)}
                  </Typography>

                  <Typography variant="body2" fontWeight={400}>
                    Gasto: {formatCurrencyString(limit.currentSpending)}
                  </Typography>

                  <Typography variant="body2" fontWeight={400}>
                    Excesso: {limit.percentageUsed.toFixed(0)}%
                  </Typography>
                </Box>
              </Box>
            </Alert>
          </Box>
        </Collapse>
      ))}
    </Box>
  )
}

export default LimitAlerts
