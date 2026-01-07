import React, { useEffect, useState } from 'react'
import { Box, Grid, LinearProgress, Typography } from '@mui/material'

import Paper from '~/components/layout/Paper'
import categoriesRepository, { GoalWithProgressType } from '~/client/repository/categoriesRepository'
import BallColor from '~/components/atoms/BallColor'
import { SMALL_BALL_SIZE } from '~/constants'
import useUtils from '~/shared/hooks/useUtils'

const GoalProgress = (): React.JSX.Element => {
  const [goals, setGoals] = useState<GoalWithProgressType[]>([])

  const { getGoalsWithProgress } = categoriesRepository()
  const { formatCurrencyString } = useUtils()

  useEffect(() => {
    getGoalsWithProgress().then(
      (response) => {
        setGoals(response)
      }
    )
  }, [])

  const getProgressColor = (percentage: number): 'success' | 'warning' | 'info' => {
    if (percentage >= 100) return 'info'
    if (percentage >= 80) return 'warning'
    return 'success'
  }

  if (goals.length === 0) {
    return <></>
  }

  return (
    <Box flex="auto" >
      <Paper>
        <Box mb={2}>
          <Typography variant="subtitle1" fontWeight={500}>
            Progresso das Metas
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" gap={2}>
          {goals.map((goal, index) => (
            <Box key={index}>
              <Grid container display="flex" alignItems="center" spacing={2}>
                <Grid item xs={12} md={3}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <BallColor color={goal.color} size={SMALL_BALL_SIZE} />
                    <Typography variant="body2" fontWeight={500}>{goal.name}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Box>
                    <Typography variant="body1" color="Gray">Meta</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatCurrencyString(goal.valueGoal ?? 0)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Box>
                    <Typography variant="body1" color="Gray">Economizado</Typography>
                    <Typography variant="body2" fontWeight={500} color={goal.isAchieved ? 'info' : 'inherit'}>
                      {formatCurrencyString(goal.currentAmount)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={12} lg={5}>
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="caption">Progresso</Typography>
                      <Typography variant="caption" fontWeight={500}>
                        {goal.percentageProgress.toFixed(0)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(goal.percentageProgress, 100)}
                      color={getProgressColor(goal.percentageProgress)}
                    />
                  </Box>
                </Grid>
              </Grid>

              {index < goals.length - 1 && (
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

export default GoalProgress
