import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Button, Grid, Theme, Typography, useMediaQuery } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import dayjs from 'dayjs'
import { BarChart, LineChart, pieArcLabelClasses, PieChart } from '@mui/x-charts'
import { endOfDay, endOfMonth, endOfYear, format, startOfDay, startOfMonth, startOfYear } from 'date-fns'

import ContainerMain from '~/components/layout/ContainerMain'
import Paper from '~/components/layout/Paper'
import { DEFAULT_BR_FORMAT_DATE, DEFAULT_FORMAT_DATE, DEFAULT_OVER_PAGESIZE, DEFAULT_SHORT_FORMAT_DATE, LABEL_MONTHS, Segments, TypesCharts } from '~/constants'
import { BuildChartSimplePieType, BuildChartSimpleType, ChartSimpleType, ChartsType, TypesChartsType } from '~/models/charts'
import transactionsRepository from '~/client/repository/transactionsRepository'
import { FilterTransactionType } from '~/client/models/transactions'
import useUtils from '~/shared/hooks/useUtils'
import useBuildCharts from '~/shared/hooks/useBuildCharts'
import InputForm from '~/components/atoms/inputs/InputForm'
import InputBasicDate from '~/components/atoms/inputs/InputBasicDate'

const useStyles = makeStyles(() => ({
  paperChart: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))

const defaultFilter: FilterTransactionType = {
  term: '',
  page: 1,
  take: DEFAULT_OVER_PAGESIZE,
  category: '',
  endDate: format(endOfYear(new Date()), DEFAULT_FORMAT_DATE),
  startDate: format(startOfYear(new Date()), DEFAULT_FORMAT_DATE),
  segment: ''
}

type SizeType = {
  width: number
  height: number
}

const Stats = (): React.JSX.Element => {
  const [viewChart, setViewChart] = useState<ChartSimpleType[]>([])
  const [viewMonthsChart, setViewMonthsChart] = useState<BuildChartSimpleType[]>([])
  const [viewPieSimpleChart, setViewPieSimpleChart] = useState<{
    expense: BuildChartSimplePieType[]
    receive: BuildChartSimplePieType[]
  }>({ expense: [], receive: [] })

  const [currentChart, setCurrentChart] = useState<TypesChartsType>('SimpleMonth')
  const [filter, setFilter] = useState<FilterTransactionType>(defaultFilter)

  const styles = useStyles()
  const { buildSimpleChart, buildSimplePieChartByMonth } = useBuildCharts()
  const { getTransactions } = transactionsRepository()
  const { formatCurrencyString } = useUtils()

  const downSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  const downXL = useMediaQuery((theme: Theme) => theme.breakpoints.down('xl'))

  const chartPieSize = useMemo((): SizeType => {
    if (downSM) {
      return { width: 450, height: 300 }
    }

    if (downMD) {
      return { width: 450, height: 300 }
    }

    if (downLG) {
      return { width: 550, height: 400 }
    }

    if (downXL) {
      return { width: 500, height: 380 }
    }

    return { width: 550, height: 400 }
  }, [downSM, downMD, downLG, downXL])

  const getAll = useCallback((newFilter: FilterTransactionType, typeChart: TypesChartsType = 'SimpleMonth') => {
    getTransactions(newFilter).then(
      (response) => {
        const data = response.data ?? []

        const setDataSimpleCharts = (): void => {
          const responseSimpleMonth = buildSimpleChart(data)
          setViewMonthsChart(responseSimpleMonth.monthsInChart)
          setViewChart(responseSimpleMonth.builtInChart)
        }

        switch (typeChart) {
          case 'SimpleMonth':
            setDataSimpleCharts()
            setDataSimpleCharts()
            break

          case 'SimpleCategories':
            setViewPieSimpleChart(buildSimplePieChartByMonth(data))
            break

          default:
            break
        }
      }
    )
  }, [getTransactions, filter])

  const handleChooseChart = (item: ChartsType): void => {
    let newFilter = defaultFilter

    if (item.key === 'SimpleCategories') {
      const now = new Date()

      const start = startOfMonth(now)
      const end = endOfMonth(now)

      newFilter = {
        ...newFilter,
        startDate: format(start, DEFAULT_FORMAT_DATE),
        endDate: format(end, DEFAULT_FORMAT_DATE)
      }
    }

    setCurrentChart(item.key)
    setFilter(newFilter)
    getAll(newFilter, item.key)
  }

  const handleFilter = (): void => {
    getAll(filter, currentChart)
  }

  useEffect(() => {
    getAll(defaultFilter)
  }, [])

  return (
    <ContainerMain title="Estatísticas" fullCard={false} >
      <Box display="flex" justifyContent="end" mb={2}>
        <Paper fullWidth>
          <Box display="flex" flexWrap="wrap" gap={2} alignItems="end" justifyContent="center">
            <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" justifyContent="center">
              {TypesCharts.map((item, index) => (
                <React.Fragment key={`type-chart-${index}`}>
                  <Button
                    variant={currentChart === item.key ? 'contained' : 'outlined'}
                    onClick={() => { handleChooseChart(item) }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box>
                        {item.icon(currentChart === item.key ? '#fff' : undefined)}
                      </Box>

                      <Box>
                        {item.title}
                      </Box>
                    </Box>
                  </Button>
                </React.Fragment>
              ))}
            </Box>

            <Box display="flex" alignItems="end" gap={1.1}>
              <Box width={200}>
                <InputForm fullWidth title="Data inicial">
                  <InputBasicDate
                    placeholder="Informe uma data"
                    value={filter.startDate === '' ? null : dayjs(format(new Date(filter.startDate), DEFAULT_SHORT_FORMAT_DATE))}
                    onChange={(value: dayjs.Dayjs) => {
                      const newDate = startOfDay(new Date(value.toISOString()))
                      setFilter({ ...filter, startDate: format(newDate, DEFAULT_FORMAT_DATE) })
                    }}
                  />
                </InputForm>
              </Box>

              <Box width={200}>
                <InputForm fullWidth title="Data final">
                  <InputBasicDate
                    placeholder="Informe uma data"
                    value={filter.endDate === '' ? null : dayjs(format(new Date(filter.endDate), DEFAULT_SHORT_FORMAT_DATE))}
                    onChange={(value: dayjs.Dayjs) => {
                      const newDate = endOfDay(new Date(value.toISOString()))
                      setFilter({ ...filter, endDate: format(newDate, DEFAULT_FORMAT_DATE) })
                    }}
                  />
                </InputForm>
              </Box>

              <Box>
                <Button variant="contained" color="primary" onClick={handleFilter}>
                  Filtrar
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Box display="flex" height={1} overflow="auto" flexGrow={1} flexDirection="column" justifyItems="center">
        <Box textAlign="center" mb={2}>
          <Typography variant="h6" color="text.main">
            {format(filter.startDate, DEFAULT_BR_FORMAT_DATE)}
            {' até '}
            {format(filter.endDate, DEFAULT_BR_FORMAT_DATE)}
          </Typography>
        </Box>

        <Box display="flex" width={1} flexDirection="column" justifyContent="center" alignItems="center">
          {currentChart === 'SimpleMonth' && (
            <Box display="flex" width={1} gap={4}>
              <Box flex={1}>
                <Paper className={styles.paperChart}>
                  <BarChart
                    borderRadius={15}
                    series={viewChart}
                    dataset={viewMonthsChart}
                    yAxis={[{ position: 'left', width: 60 }]}
                    xAxis={[
                      {
                        data: viewMonthsChart.map(e => LABEL_MONTHS[e.month]),
                        scaleType: 'band',
                        tickSize: 10,
                        categoryGapRatio: 0.9,
                        height: 30
                      }
                    ]}
                    colors={[Segments.Receita.color, Segments.Despesa.color]}
                    height={550}
                  />
                </Paper>
              </Box>

              <Box flex={1}>
                <Paper>
                  <LineChart
                    height={550}
                    series={viewChart}
                    yAxis={[{ position: 'left', width: 60 }]}
                    xAxis={[{ scaleType: 'point', data: viewMonthsChart.map(e => LABEL_MONTHS[e.month]) }]}
                    colors={[Segments.Receita.color, Segments.Despesa.color]}
                  />
                </Paper>
              </Box>
            </Box>
          )}

          {currentChart === 'SimpleCategories' && (
            <Grid container>
              <Grid item xs={12} lg={6} display="flex" flexDirection="column" alignItems="center">
                <Box textAlign="center" mb={3}>
                  <Typography variant="h6" color="text.main">
                    Ganhos
                  </Typography>
                </Box>

                <PieChart
                  series={[
                    {
                      data: viewPieSimpleChart.receive,
                      arcLabel: (item) => formatCurrencyString(item.value)
                    }
                  ]}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: 'white',
                      fontWeight: '500'
                    }
                  }}
                  width={chartPieSize.width}
                  height={chartPieSize.height}
                />
              </Grid>

              <Grid item xs={12} lg={6} display="flex" flexDirection="column" alignItems="center">
                <Box textAlign="center" mb={3}>
                  <Typography variant="h6" color="text.main">
                    Gastos
                  </Typography>
                </Box>

                <PieChart
                  series={[
                    {
                      data: viewPieSimpleChart.expense,
                      arcLabel: (item) => formatCurrencyString(item.value)
                    }
                  ]}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: 'white',
                      fontWeight: '500'
                    }
                  }}
                  width={chartPieSize.width}
                  height={chartPieSize.height}
                />
              </Grid>
            </Grid>
          )}
        </Box>
        {/* </Paper> */}
      </Box>
    </ContainerMain >
  )
}

export default Stats
