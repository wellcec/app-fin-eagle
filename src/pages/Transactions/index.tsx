import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Button, Divider, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { compareAsc, endOfMonth, format, getYear, startOfMonth } from 'date-fns'
import { useLocation } from 'react-router-dom'

import { FilterTransactionType, TransactionType } from '~/client/models/transactions'
import ContainerMain from '~/components/layout/ContainerMain'
import Paper from '~/components/layout/Paper'
import { DEFAULT_FORMAT_DATE, DEFAULT_OVER_PAGESIZE, LABEL_MONTHS, Segments } from '~/constants'
import transactionsRepository from '~/client/repository/transactionsRepository'
import AddTransactionModal from './fragments/AddTransactionModal'
import useUtils from '~/shared/hooks/useUtils'

import useDebounce from '~/shared/hooks/useDebounce'
import useAlerts from '~/shared/alerts/useAlerts'
import Dialog from '~/components/molecules/Dialog'
import { Titles } from '~/constants/menus'
import Controls from './fragments/Controls'
import TransactionItem from './fragments/TransactionItem'
import useTransactions from '~/shared/hooks/useTransactions'
import { emptyFilter } from '~/constants/transactions'
import { TransactionModalType } from '~/models'
import { Provider } from './fragments/context'

const useStyles = makeStyles(() => ({
  toggleMonthFilter: {
    width: '100%',
    '& .MuiToggleButton-root': {
      textTransform: 'none',
      width: '100%',
      paddingTop: 8,
      paddingBottom: 8
    },
    '& .MuiToggleButtonGroup-firstButton': {
      textTransform: 'none',
      borderBottomLeftRadius: 20,
      borderTopLeftRadius: 20,
    },
    '& .MuiToggleButtonGroup-lastButton': {
      textTransform: 'none',
      borderBottomRightRadius: 20,
      borderTopRightRadius: 20,
    }
  }
}))

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
  const [includeGoalActive, setIncludeGoalActive] = useState<boolean>(false);
  const [transactionModalType, setTransactionModalType] = useState<TransactionModalType>('income');

  const styles = useStyles()
  const { formatCurrencyString } = useUtils()
  const { notifyWarning, notifyError, notifySuccess } = useAlerts()
  const { buildValuesTransactions, buildViewTransactions, getNameMonthCurrentFilter } = useTransactions()
  const { getTransactions, deleteTransaction } = transactionsRepository()
  const { debounceWait } = useDebounce()

  const { state } = useLocation() as { state: { openAdd: boolean, type: 'Receita' | 'Despesa' } | null }

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

    setMonthFilter(-1)
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

  const handleSelectMonth = (_: React.MouseEvent<HTMLElement>, value: number): void => {
    setStartDate('')
    setEndDate('')

    const monthNumber = value
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

  useEffect(() => {
    if (state?.openAdd) {
      state.type === 'Despesa' ? setTransactionModalType('expense') : setTransactionModalType('income')
      setOpenAddTransaction(true)
    }
  }, [state])

  useEffect(() => {
    const newFilter: FilterTransactionType = {
      ...filter,
      isGoal: includeGoalActive ? undefined : 0
    }

    setFilter(newFilter)
    getAll(newFilter)
  }, [includeGoalActive]);

  useEffect(() => {
    if (startDate !== '' && endDate !== '') {
      handleFilter()
    }
  }, [startDate, endDate])

  useEffect(() => {
    getAll(filter)
  }, [])

  return (
    <Provider value={{
      openAddTransaction,
      setOpenAddTransaction,
      includeGoalActive,
      setIncludeGoalActive,
      transactionModalType,
      setTransactionModalType
    }}>
      <ContainerMain title={Titles.TRANSACTIONS} fullCard={false}>
        <Controls
          showFilter={showFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          setShowFilter={setShowFilter}
          handleChangeSearch={handleChangeSearch}
          handleClearFilter={handleClearFilter}
          handleFilter={handleFilter}
        />

        <Box mb={1}>
          <Paper grid>
            <Box>
              <ToggleButtonGroup
                exclusive
                value={monthFilter}
                onChange={handleSelectMonth}
                className={styles.toggleMonthFilter}
              >
                {LABEL_MONTHS.map((item, index) => (
                  <ToggleButton key={`month-filter-${index}`} value={index}>
                    {item}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          </Paper>
        </Box>

        <Box mb={1} textAlign="center">
          <Paper grid>
            <Box display="flex" alignItems="center" justifyContent="end" gap={2}>
              {(endDate === '' && startDate === '') && (
                <Typography
                  variant="subtitle1"
                  component="div"
                  dangerouslySetInnerHTML={{ __html: getNameMonthCurrentFilter(filter) }}
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

        <Box mb={2}>
          <Typography variant="caption">
            * Transações de metas não são mostradas por padrão. Utilize o filtro para incluí-las na listagem.
          </Typography>
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
                <React.Fragment key={`transaction-key-${index}`}>
                  <TransactionItem transaction={item} handleConfirmDelete={handleConfirmDelete} />
                </React.Fragment>
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
            type={transactionModalType}
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
    </Provider>
  )
}

export default Transactions
