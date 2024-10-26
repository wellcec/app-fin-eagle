import { Box, Grid } from '@mui/material'
import React from 'react'
import ContainerMain from '~/components/layout/ContainerMain'
import GeneralScore from './GeneralScore'
import CategoryScore from './CategoryScore'

const Dashboard = (): React.JSX.Element => {
  return (
    <ContainerMain title="Dashboard" fullCard isPaper={false}>
      {/* <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={6}>
          <Box minWidth={500}>
            <GeneralScore />
          </Box>
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <Box minWidth={515}>
            <CategoryScore />
          </Box>
        </Grid>
      </Grid> */}

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
