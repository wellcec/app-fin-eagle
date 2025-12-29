import React, { useCallback, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Box, Button, Divider, Grid, IconButton, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import StarIcon from '@mui/icons-material/Star'
import { compareAsc, compareDesc, endOfDay, endOfMonth, format, getDate, getDay, getMonth, getYear, startOfDay, startOfMonth } from 'date-fns'

import { FilterTransactionType, TransactionType } from '~/client/models/transactions'
import InputSearch from '~/components/atoms/inputs/InputSearch'
import ContainerMain from '~/components/layout/ContainerMain'
import Paper from '~/components/layout/Paper'
import { DEFAULT_BR_FORMAT_DATE, DEFAULT_FORMAT_DATE, DEFAULT_GAP_IZE, DEFAULT_OVER_PAGESIZE, DEFAULT_SHORT_FORMAT_DATE, DefaultsSegments, LABEL_DAYS, LABEL_MONTHS, Segments } from '~/constants'
import transactionsRepository from '~/client/repository/transactionsRepository'
import AddTransactionModal from './fragments/AddTransactionModal'
import useUtils from '~/shared/hooks/useUtils'
import Chip from '~/components/atoms/Chip'

import { IconDelete, IconDoubleArrowDown, IconFilter, IconTransaction } from '~/constants/icons'
import useDebounce from '~/shared/hooks/useDebounce'
import InputForm from '~/components/atoms/inputs/InputForm'
import InputBasicDate from '~/components/atoms/inputs/InputBasicDate'
import useAlerts from '~/shared/alerts/useAlerts'
import Dialog from '~/components/molecules/Dialog'
import colors from '~/layout/theme/colors'
import AddButton from '~/components/atoms/buttons/AddButton'

const IconArrowSelect = (): React.JSX.Element => {
  return <Box mr={1} mt={0.5}><IconDoubleArrowDown /></Box>
}

const useStyles = makeStyles(() => ({
  description: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textWrap: 'nowrap'
  },
  formCheckBox: {
    flexDirection: 'row'
  }
}))

const emptyFilter: FilterTransactionType = {
  term: '',
  page: 1,
  take: DEFAULT_OVER_PAGESIZE,
  category: '',
  endDate: format(endOfMonth(new Date()), DEFAULT_FORMAT_DATE),
  startDate: format(startOfMonth(new Date()), DEFAULT_FORMAT_DATE),
  segment: ''
}

type ViewTransactionsType = {
  day: number
  dayLocale: string
  transactions: TransactionType[]
}

type ViewValuesTransactionsType = {
  receive: number
  expense: number
  total: number
}

const Transactions = (): React.JSX.Element => {
  const [filter, setFilter] = useState<FilterTransactionType>(emptyFilter)
  const [totalTransactions, setTotalTransactions] = useState<number>(0)
  const [transactions, setTransactions] = useState<TransactionType[]>([])
  const [openAddTransaction, setOpenAddTransaction] = useState<boolean>(false)
  const [showFilter, setShowFilter] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [objToAction, setObjToAction] = useState<TransactionType>()
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false)
  const [monthFilter, setMonthFilter] = useState<number>(-1)

  const styles = useStyles()
  const { formatCurrencyString } = useUtils()
  const { notifyWarning, notifyError, notifySuccess } = useAlerts()
  const { getTransactions, deleteTransaction } = transactionsRepository()
  const { debounceWait } = useDebounce()

  const getColorSegment = (item: TransactionType): string => {
    return Segments[item?.segment ?? DefaultsSegments.Receive].color
  }

  const buildViewTransactions = (list: TransactionType[]): ViewTransactionsType[] => {
    const currentView: ViewTransactionsType[] = []

    for (const t of list) {
      const currentDate = new Date(t.date ?? '')
      const day = getDate(currentDate)
      const month = getMonth(currentDate)
      const year = getYear(currentDate)
      const dayWeek = getDay(currentDate)

      const transactionDay = currentView.find((cv) => cv.day === day)
      if (!transactionDay) {
        const newView: ViewTransactionsType = {
          day,
          dayLocale: `${LABEL_DAYS[dayWeek]}, ${day} de ${LABEL_MONTHS[month]} de ${year}`,
          transactions: [t]
        }

        currentView.push(newView)
      } else {
        const newTransactions = transactionDay.transactions
        newTransactions.push(t)

        const sortedTransactions = newTransactions.sort((a, b) => {
          if (!a.date || !b.date) return 0
          return compareDesc(a.date, b.date)
        })

        const transactionIndex = currentView.indexOf(transactionDay)
        currentView[transactionIndex].transactions = sortedTransactions
      }
    }

    return currentView
  }

  const buildValuesTransactions = (list: TransactionType[]): ViewValuesTransactionsType => {
    let receive = 0
    let expense = 0

    for (const t of list) {
      if (t.segment === DefaultsSegments.Receive) {
        receive += t.value
      }

      if (t.segment === DefaultsSegments.Expense) {
        expense += t.value
      }
    }

    return { receive, expense, total: receive - expense }
  }

  const viewTransactions = useMemo(() => buildViewTransactions(transactions), [transactions])

  const valuesTransactions = useMemo(() => buildValuesTransactions(transactions), [transactions])

  const getAll = useCallback((newFilter: FilterTransactionType) => {
    getTransactions(newFilter).then(
      (response) => {
        const data = response.data ?? []
        const total = response.count ?? 0
        setTransactions(data)
        setTotalTransactions(total)
      }
    )
  }, [getTransactions, filter])

  const getAllForPage = useCallback((newFilter: FilterTransactionType) => {
    getTransactions(newFilter).then(
      (response) => {
        const data = response.data ?? []
        const total = response.count ?? 0

        const newArr = transactions.concat(data)
        setTransactions(newArr)
        setTotalTransactions(total)
      }
    )
  }, [getTransactions, filter])

  const deleteTransact = useCallback(() => {
    deleteTransaction(objToAction?.id ?? '').then(
      (response) => {
        if (response) {
          notifySuccess('Movimentação excluída')
          setConfirmOpen(false)
          setObjToAction(undefined)
          getAll(filter)

          return
        }

        notifyError('Algo deu errado ao excluir movimentação')
      }
    )
  }, [deleteTransaction, objToAction, getAll, notifyError, notifySuccess])

  const handleChangePage = (): void => {
    const newFilter = { ...filter, page: filter.page + 1 }
    setFilter(newFilter)
    getAllForPage(newFilter)
  }

  const handleFilter = (): void => {
    const dateCompareStart = new Date(startDate)
    const dateCompareEnd = new Date(endDate)

    if (compareAsc(dateCompareStart, dateCompareEnd) === 1) {
      notifyWarning('Data inicial deve ser anterior a data final')
      return
    }

    const newFilter = {
      ...filter,
      page: 1,
      startDate,
      endDate
    }

    setFilter(newFilter)
    getAll(newFilter)
  }

  const handleClearFilter = (): void => {
    setShowFilter(!showFilter)
    setStartDate('')
    setEndDate('')
    setMonthFilter(-1)
    setFilter(emptyFilter)
    getAll(emptyFilter)
  }

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { value } = event.target

    const newFilter = {
      ...filter,
      term: value,
      page: 1
    }

    setFilter(newFilter)

    debounceWait(() => { getAll(newFilter) })
  }

  const onCreateTransaction = (): void => {
    setMonthFilter(-1)
    setFilter(emptyFilter)
    getAll(emptyFilter)
    setOpenAddTransaction(!openAddTransaction)
  }

  const handleConfirmDelete = (obj: TransactionType): void => {
    setObjToAction(obj)
    setConfirmOpen(true)
  }

  const handleCloseDelete = (): void => { setConfirmOpen(false) }

  const handleCloseModal = (): void => { setOpenAddTransaction(!openAddTransaction) }

  const handleSelectMonth = (event: SelectChangeEvent<number>): void => {
    setStartDate('')
    setEndDate('')

    const monthNumber = parseInt(event?.target?.value.toString())
    const now = new Date()
    const year = getYear(now)
    const date = new Date(year, monthNumber, 1)

    const start = startOfMonth(date)
    const end = endOfMonth(date)

    const newFilter: FilterTransactionType = {
      ...emptyFilter,
      startDate: format(start, DEFAULT_FORMAT_DATE),
      endDate: format(end, DEFAULT_FORMAT_DATE)
    }

    setMonthFilter(monthNumber)
    setFilter(newFilter)
    getAll(newFilter)
  }

  const getNameMonthCurrentFilter = (): string => {
    const currentDate = new Date()
    const currentMonthNumber = getMonth(currentDate)

    if (filter.startDate != '') {
      const date = new Date(filter.startDate)

      if (currentMonthNumber === getMonth(date)) {
        return `Neste mês:`
      }

      return `Em <b>${LABEL_MONTHS[getMonth(date)]} de ${getYear(date)}</b>: `
    }

    return ''
  }

  useEffect(() => {
    getAll(filter)
  }, [])

  return (
    <ContainerMain title="Transações" fullCard={false}>
      <Box display="flex" flexGrow={0} justifyContent="end" mb={2}>
        <Paper fullWidth>
          <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" mb={showFilter ? 2 : 0}>
            <Box flexGrow={1}>
              <InputSearch placeholder="Procure por descrição" onChange={handleChangeSearch} />
            </Box>

            <Box>
              <IconButton title="Filtrar" onClick={() => { setShowFilter(!showFilter) }}>
                <IconFilter />
              </IconButton>
            </Box>

            <Box>
              <AddButton label="Nova transação" handleClick={() => { setOpenAddTransaction(!openAddTransaction) }} />
            </Box>
          </Box>

          {showFilter && (
            <>
              <Box display="flex" flexWrap="wrap" gap={3} alignItems="end" justifyContent="space-between">
                <Box display="flex" flexWrap="nowrap" gap={3} alignItems="center" flex={1} justifyContent="center">
                  <Box width={200}>
                    <InputForm fullWidth title="Data inicial">
                      <InputBasicDate
                        placeholder="Informe uma data"
                        value={startDate === '' ? null : dayjs(format(new Date(startDate), DEFAULT_SHORT_FORMAT_DATE))}
                        onChange={(value: dayjs.Dayjs) => {
                          const newDate = startOfDay(new Date(value.toISOString()))
                          setStartDate(format(newDate, DEFAULT_FORMAT_DATE))
                        }}
                      />
                    </InputForm>
                  </Box>

                  <Box width={200}>
                    <InputForm fullWidth title="Data final">
                      <InputBasicDate
                        placeholder="Informe uma data"
                        value={endDate === '' ? null : dayjs(format(new Date(endDate), DEFAULT_SHORT_FORMAT_DATE))}
                        onChange={(value: dayjs.Dayjs) => {
                          const newDate = endOfDay(new Date(value.toISOString()))
                          setEndDate(format(newDate, DEFAULT_FORMAT_DATE))
                        }}
                      />
                    </InputForm>
                  </Box>

                  <Box width={200}>
                    <InputForm fullWidth title="Filtre por mês">
                      <Select
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={monthFilter}
                        defaultValue={-1}
                        onChange={handleSelectMonth}
                        IconComponent={IconArrowSelect}
                      >
                        <MenuItem value={-1} disabled>
                          <Box display="flex" alignItems="center" gap={DEFAULT_GAP_IZE}>
                            <Box>
                              Mês
                            </Box>
                          </Box>
                        </MenuItem>

                        {LABEL_MONTHS.map((item, index) => (
                          <MenuItem key={`month-filter-${index}`} value={index}>
                            <Box display="flex" alignItems="center" gap={DEFAULT_GAP_IZE}>
                              <Box>
                                {item}
                              </Box>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </InputForm>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" justifyContent="end" gap={1} mt={2}>
                  <Button variant="outlined" color="primary" onClick={handleClearFilter}>
                    Limpar
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleFilter}>
                    Filtrar
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Paper>
      </Box>

      <Box pb={1} mb={2} textAlign="center">
        <Paper grid>
          <Box display="flex" alignItems="center" justifyContent="end" gap={2}>
            {(endDate === '' && startDate === '') && (
              <Typography
                variant="subtitle1"
                component="div"
                dangerouslySetInnerHTML={{ __html: getNameMonthCurrentFilter() }}
              />
            )}

            <Typography variant="h6" component="div" color={Segments.Receita.color}>
              +{formatCurrencyString(valuesTransactions.receive)}
            </Typography>
            <Typography variant="h6" component="div" color={Segments.Despesa.color}>
              -{formatCurrencyString(valuesTransactions.expense)}
            </Typography>
            <Typography variant="h6" component="div" color={valuesTransactions.total > 0 ? Segments.Receita.color : Segments.Despesa.color}>
              =
              {' '}
              {formatCurrencyString(valuesTransactions.total)}
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Box overflow="auto" flexGrow={1} pr={1}>
        {transactions.length === 0 && (
          <Box pb={1} mb={2} textAlign="center">
            <Paper>
              <Typography variant="body2">Nenhuma movimentação encontrada</Typography>
            </Paper>
          </Box>
        )}

        {viewTransactions.map((item, index) => (
          <React.Fragment key={`viewTransaction-key-${index}`}>
            <Box mt={3} mb={3} textAlign="center">
              <Divider>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Typography variant="body1">{item.dayLocale}</Typography>
                </Box>
              </Divider>
            </Box>

            {item.transactions.map((item, index) => (
              <Box key={`transaction-key-${index}`} pb={1} mb={0.1}>
                <Paper grid color={getColorSegment(item)}>
                  <Grid container display="flex" alignItems="center">
                    <Grid display="flex" alignItems="center" item xs={1}>
                      {item.segment === DefaultsSegments.Receive && (
                        <Box style={{ transform: 'rotate(180deg)' }}>
                          <IconTransaction color={getColorSegment(item)} />
                        </Box>
                      )}

                      {item.segment === DefaultsSegments.Expense && (
                        <IconTransaction color={getColorSegment(item)} />
                      )}
                    </Grid>

                    <Grid item xs={1}>
                      <Typography variant="body1" color={getColorSegment(item)}>
                        {format(item.date ?? new Date(), DEFAULT_BR_FORMAT_DATE)}
                      </Typography>
                    </Grid>

                    <Grid item xs={2}>
                      <Typography variant="body1" color={getColorSegment(item)}>
                        {item.segment === DefaultsSegments.Receive ? '+' : '-'}
                        {formatCurrencyString(item.value)}
                      </Typography>
                    </Grid>

                    <Grid item xs={2} display="flex">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip label={item.name ?? ''} color={item.color ?? ''} />
                        {item.isGoal === 1 && (
                          <StarIcon htmlColor={colors.danger.main} />
                        )}
                      </Box>
                    </Grid>

                    <Grid item xs={5} display="flex">
                      <Typography variant="body1" className={styles.description}>{item.description}</Typography>
                    </Grid>

                    <Grid item xs={1} display="flex" alignItems="flex-end" justifyContent="flex-end" gap={1}>
                      <Box display="flex">
                        <IconButton title="Excluir" onClick={() => { handleConfirmDelete(item) }} sx={{ padding: 0 }}>
                          <IconDelete />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            ))}
          </React.Fragment>
        ))}

        {(totalTransactions >= DEFAULT_OVER_PAGESIZE) && !(transactions.length === totalTransactions) && (
          <Box display="flex" justifyContent="center" mt={3} mb={1}>
            <Button variant="outlined" onClick={handleChangePage}>
              Carregar mais...
            </Button>
          </Box>
        )}
      </Box>

      {openAddTransaction && (
        <AddTransactionModal
          objToEdit={null}
          open={openAddTransaction}
          handleClose={handleCloseModal}
          callback={onCreateTransaction}
        />
      )}

      {confirmOpen && (
        <Dialog
          title="Excluir movimentação"
          open={confirmOpen}
          handleCloseConfirm={handleCloseDelete}
          handleDelete={deleteTransact}
        >
          <Typography variant="body1" color="primary">
            Deseja realmente excluir a movimentação de
            {' '}
            <b>{formatCurrencyString(objToAction?.value ?? 0)}</b>
            ?
          </Typography>
        </Dialog>
      )}
    </ContainerMain>
  )
}

export default Transactions
