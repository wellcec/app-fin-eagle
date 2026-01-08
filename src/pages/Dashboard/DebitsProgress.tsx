import React, { useEffect, useState } from 'react'
import { Box, Grid, LinearProgress, Typography } from '@mui/material'

import Paper from '~/components/layout/Paper'
import categoriesRepository, { GoalDebitProgressType } from '~/client/repository/categoriesRepository'
import BallColor from '~/components/atoms/BallColor'
import { SMALL_BALL_SIZE } from '~/constants'
import useUtils from '~/shared/hooks/useUtils'

const DebitsProgress = (): React.JSX.Element => {
  const [debits, setDebits] = useState<GoalDebitProgressType[]>([])

  const { getDebitsWithProgress } = categoriesRepository()
  const { getProgressColor, formatCurrencyString } = useUtils()

  useEffect(() => {
    getDebitsWithProgress().then(
      (response) => {
        setDebits(response)
      }
    )
  }, [])

  if (debits.length === 0) {
    return <></>
  }

  return (
    <Box flex="auto" >
      <Paper>
        <Box mb={2}>
          <Typography variant="subtitle1" fontWeight={500}>
            Progresso das Dívidas
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" gap={2}>
          {debits.map((debit, index) => (
            <Box key={index}>
              <Grid container display="flex" alignItems="center" spacing={2}>
                <Grid item xs={12} md={3}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <BallColor color={debit.color} size={SMALL_BALL_SIZE} />
                    <Typography variant="body2" fontWeight={500}>{debit.name}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Box>
                    <Typography variant="body1" color="Gray">Total</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatCurrencyString((debit.valueGoal ?? 0) * (debit.installments ?? 0))}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Box>
                    <Typography variant="body1" color="Gray">Pago</Typography>
                    <Typography variant="body2" fontWeight={500} color={debit.isAchieved ? 'info' : 'inherit'}>
                      {formatCurrencyString((debit.valueGoal ?? 0) * (debit.currentInstallments ?? 0))}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={12} lg={5}>
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="caption">Progresso</Typography>
                      <Typography variant="caption" fontWeight={500}>
                        {debit.percentageProgress.toFixed(0)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(debit.percentageProgress, 100)}
                      color={getProgressColor(debit.percentageProgress)}
                    />
                  </Box>
                </Grid>
              </Grid>

              {index < debits.length - 1 && (
                <Box mt={2} mb={0}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  )
}

export default DebitsProgress
