import { Box, Button, Divider, Typography } from '@mui/material'
import React from 'react'
import { ScheduleType } from '~/client/models/schedules'
import colors from '~/layout/theme/colors'

interface DescriptionProps {
  scheduleToShow?: ScheduleType
  setSteps: React.Dispatch<React.SetStateAction<number>>
  steps: any
  SCREEN_SIZE: number
}

const Description = ({ scheduleToShow, setSteps, steps, SCREEN_SIZE }: DescriptionProps) => {
  return (
    <Box>
      <Box display="flex" flexDirection="column" mb={1}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Título
          </Typography>
        </Box>

        <Typography variant="subtitle1" fontWeight={500}>
          {scheduleToShow?.title}
        </Typography>
      </Box>

      <Box mb={1}>
        <Typography variant="caption" color="text.secondary">
          Observação
        </Typography>
      </Box>

      <Box border={`1px solid ${colors.text.secondary}`} borderRadius={3} p={3} mb={2}>
        <Box whiteSpace="pre-wrap" width={SCREEN_SIZE}>
          <Typography variant="body1" color="primary">
            {scheduleToShow?.description}
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Box textAlign="end" mt={2}>
        <Button variant="outlined" color="primary" onClick={() => setSteps(steps.adding)}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box>
              Voltar
            </Box>
          </Box>
        </Button>
      </Box>
    </Box>
  )
}

export default Description