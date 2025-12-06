import React from 'react'
import { Box } from '@mui/material'
import ContainerMain from '~/components/layout/ContainerMain'
import GeneralScore from './GeneralScore'
import CategoryScore from './CategoryScore'
import LimitAlerts from './LimitAlerts'
import GoalProgress from './GoalProgress'
import TodaySchedules from './TodaySchedules'

const Dashboard = (): React.JSX.Element => {
  return (
    <ContainerMain title="Dashboard" fullCard isPaper={false}>
      <LimitAlerts />
      <GeneralScore />

      <Box display="flex" flexWrap="wrap" gap={2.3}>
        <CategoryScore />
        <TodaySchedules />
        <GoalProgress />
      </Box>
    </ContainerMain>
  )
}

export default Dashboard
