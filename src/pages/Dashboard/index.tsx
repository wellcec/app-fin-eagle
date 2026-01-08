import React from 'react'
import { Box, Grid } from '@mui/material'

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
import NoTransactionsWarning from './NoTransactionsWarning'
import DebitsProgress from './DebitsProgress'

const Dashboard = (): React.JSX.Element => {
  return (
    <ContainerMain title={Titles.DASHBOARD} fullCard isPaper={false}>
      <Box display="flex" flexDirection="column" gap={2} mb={2}>
        <LimitAlerts />
        <QuickActions />
        <GeneralScore />
      </Box>

      <Grid container spacing={2} mb={2}>
        <Grid display="flex" flexDirection="column" item md={12} lg={6} gap={2}>
          <CategoryScore />
          <TopExpenses />
          <DebitsProgress />
          <GoalProgress />
        </Grid>

        <Grid display="flex" flexDirection="column" item md={12} lg={6} gap={2}>
          <LatestTransactions />
          <TodaySchedules />
        </Grid>
      </Grid>

      <NoTransactionsWarning />
    </ContainerMain >
  )
}

export default Dashboard
