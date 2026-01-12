import { Box, Grid, LinearProgress, Typography } from '@mui/material'
import React from 'react'
import { GoalWithProgressType } from '~/client/repository/categoriesRepository'
import BallColor from '~/components/atoms/BallColor'
import Paper from '~/components/layout/Paper'
import { SMALL_BALL_SIZE } from '~/constants'
import { CategoryTypeEnum } from '~/constants/categories'
import useUtils from '~/shared/hooks/useUtils'

interface GoalProgressProps {
  title: string
  items: GoalWithProgressType[]
  type: CategoryTypeEnum
}

const GoalProgressItem = ({ title, items, type }: GoalProgressProps) => {
  const { getProgressColor, formatCurrencyString } = useUtils()

  const getTextValue = () => {
    switch (type) {
      case CategoryTypeEnum.Debit:
        return 'Pago'
      case CategoryTypeEnum.Goal:
        return 'Economizado'
      default:
        break;
    }
  }

  const getValueView = (item: GoalWithProgressType) => {
    if (type === CategoryTypeEnum.Debit) {
      return formatCurrencyString((item.valueGoal ?? 0) * (item.currentInstallments ?? 0))
    }

    if (type === CategoryTypeEnum.Goal) {
      return formatCurrencyString(item.currentAmount)
    }

    return 'R$ 0,00'
  }

  return (
    <Paper>
      <Box mb={2}>
        <Typography variant="subtitle1" fontWeight={500}>
          {title}
        </Typography>
      </Box>

      <Box display="flex" flexDirection="column" gap={2}>
        {items.map((item, index) => (
          <Box key={index}>
            <Grid container display="flex" alignItems="center" spacing={2}>
              <Grid item xs={12} md={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <BallColor color={item.color} size={SMALL_BALL_SIZE} />
                  <Typography variant="body2" fontWeight={500}>{item.name}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={2}>
                <Box>
                  <Typography variant="body1" color="Gray">Meta</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formatCurrencyString(item.valueGoal ?? 0)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={2}>
                <Box>
                  <Typography variant="body1" color="Gray">{getTextValue()}</Typography>
                  <Typography variant="body2" fontWeight={500} color={item.isAchieved ? 'info' : 'inherit'}>
                    {getValueView(item)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={12} lg={5}>
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="caption">Progresso</Typography>
                    <Typography variant="caption" fontWeight={500}>
                      {item.percentageProgress.toFixed(0)}%
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={Math.min(item.percentageProgress, 100)}
                    color={getProgressColor(item.percentageProgress)}
                  />
                </Box>
              </Grid>
            </Grid>

            {index < items.length - 1 && (
              <Box mt={2} mb={0}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />
              </Box>
            )}
          </Box>
        ))}

        {(items && items.length === 0) && (
          <Box textAlign="center">
            <Typography variant="body2">
              Você ainda não concluiu nenhuma {type === CategoryTypeEnum.Debit ? 'dívida' : 'meta'} 😢
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  )
}

export default GoalProgressItem