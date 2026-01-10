import { Box, IconButton, Typography } from '@mui/material'
import React from 'react'
import { ScheduleType } from '~/client/models/schedules'
import { Icon } from '~/components/atoms/icons'
import { Segments } from '~/constants'

interface SchedulesForDayItemProps {
  item: ScheduleType
  handleShowSchedule: (item: ScheduleType) => void
  handleDeleteSchedule: (id: string) => void
}

const SchedulesForDayItem = ({ item, handleDeleteSchedule, handleShowSchedule }: SchedulesForDayItemProps) => {
  return (
    <Box
      my={1}
      px={2}
      py={1}
      sx={{
        border: `1px solid ${Segments[item.segment].color}`,
        borderRadius: 2
      }}
    >
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Typography variant="body1" sx={{ color: Segments[item.segment].color }} fontWeight={600}>
            {item.segment}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body1" color="GrayText" component="div">
            {item.isRecurrent === 1 ? <Typography color="InfoText">Recorrente</Typography> : 'Não recorrente'}
          </Typography>
        </Box>
      </Box>

      <Box display="flex">
        <Box display="flex" alignItems="center" flex={1}>
          <Typography variant="subtitle2" color="primary" >
            {item.title}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
          <IconButton title="Ver descrição" onClick={() => { handleShowSchedule(item) }}>
            <Icon name="eyeOpened" />
          </IconButton>

          <IconButton title="Excluir" onClick={() => { handleDeleteSchedule(item?.id ?? '') }}>
            <Icon name="delete" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

export default SchedulesForDayItem