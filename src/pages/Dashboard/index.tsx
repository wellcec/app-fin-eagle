import { Box } from '@mui/material'
import React from 'react'
import ContainerMain from '~/components/layout/ContainerMain'
import GeneralScore from './GeneralScore'
import CategoryScore from './CategoryScore'
import LimitAlerts from './LimitAlerts'

const Dashboard = (): React.JSX.Element => {
  return (
    <ContainerMain title="Dashboard" fullCard isPaper={false}>
      <LimitAlerts />

      <Box display="flex" flexWrap="wrap" gap={2.3}>
        <Box flex="1 1 465px" minWidth={465}>
          <GeneralScore />
        </Box>
        <Box flex="1 1 465px" minWidth={465}>
          <CategoryScore />
        </Box>
      </Box>
    </ContainerMain>
  )
}

export default Dashboard
