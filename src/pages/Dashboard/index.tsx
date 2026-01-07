import React from 'react'
import { Box } from '@mui/material'
import ContainerMain from '~/components/layout/ContainerMain'
import GeneralScore from './GeneralScore'
import CategoryScore from './CategoryScore'
import LimitAlerts from './LimitAlerts'
import GoalProgress from './GoalProgress'
import TodaySchedules from './TodaySchedules'
import { Titles } from '~/constants/menus'

import QuickActions from './fragments/QuickActions'
import LatestTransactions from './fragments/LatestTransactions'
import TopExpenses from './fragments/TopExpenses'

const Dashboard = (): React.JSX.Element => {
  return (
    <ContainerMain title={Titles.DASHBOARD} fullCard isPaper={false}>
      <Box display="flex" flexDirection="column" gap={2} mb={2}>
        <LimitAlerts />
        <QuickActions />
        <GeneralScore />
      </Box>

      <Box display="flex" flexWrap="wrap" alignItems="center" gap={2}>
        <CategoryScore />
        <TopExpenses />
        <LatestTransactions />
        <TodaySchedules />
        <GoalProgress />
      </Box>
    </ContainerMain>
  )
}

export default Dashboard
