import React, { useEffect, useState } from 'react'
import { Box, Chip, Typography } from '@mui/material'
import RepeatIcon from '@mui/icons-material/Repeat'
import { format } from 'date-fns'

import Paper from '~/components/layout/Paper'
import schedulesRepository from '~/client/repository/schedulesRepository'
import { ScheduleType } from '~/client/models/schedules'
import { DEFAULT_BR_FORMAT_DATE, Segments } from '~/constants'
import { SegmentTransactionType } from '~/client/models/transactions'

const TodaySchedules = (): React.JSX.Element => {
  const [schedules, setSchedules] = useState<ScheduleType[]>([])
  const [loading, setLoading] = useState(true)

  const { getSchedulesByDay } = schedulesRepository()

  useEffect(() => {
    const today = new Date()
    getSchedulesByDay(today).then(
      (response) => {
        setSchedules(response.data ?? [])
        setLoading(false)
      }
    ).catch(() => {
      setLoading(false)
    })
  }, [])

  const getSegmentColor = (segment: SegmentTransactionType): string => Segments[segment].color

  const getSegmentColorTranslucent = (segment: SegmentTransactionType): string => Segments[segment].colorTranslucent

  const getSegmentTitle = (segment: SegmentTransactionType): string => Segments[segment].title

  if (loading) {
    return <></>
  }

  if (schedules.length === 0) {
    return <></>
  }

  return (
    <Box mb={2} flex="auto">
      <Paper>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Typography variant="subtitle1" fontWeight={500}>
            Lembretes de Hoje
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {format(new Date(), DEFAULT_BR_FORMAT_DATE)}
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" gap={1.5}>
          {schedules.map((schedule, index) => (
            <Box
              key={`schedule-${index}`}
              sx={{
                p: 2,
                borderRadius: 4,
                border: '1px solid',
                borderColor: getSegmentColor(schedule.segment),
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: getSegmentColorTranslucent(schedule.segment)
                }
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                <Typography variant="subtitle1" fontWeight="600" color="text.primary">
                  {schedule.title}
                </Typography>
                <Box display="flex" gap={1} alignItems="center">
                  {schedule.isRecurrent === 1 && (
                    <Chip
                      icon={<RepeatIcon />}
                      label="Recorrente"
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  )}
                  <Chip
                    label={getSegmentTitle(schedule.segment)}
                    size="small"
                    sx={{
                      backgroundColor: getSegmentColor(schedule.segment),
                      color: 'white',
                      fontWeight: '500'
                    }}
                  />
                </Box>
              </Box>

              {schedule.description && (
                <Typography variant="body2" color="text.secondary">
                  {schedule.description}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  )
}

export default TodaySchedules
