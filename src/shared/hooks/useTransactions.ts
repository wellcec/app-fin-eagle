import { compareDesc, getDate, getDay, getMonth, getYear } from 'date-fns'
import { FilterTransactionType, TransactionType } from '~/client/models/transactions'
import { DefaultsSegments, LABEL_DAYS, LABEL_MONTHS } from '~/constants'

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

interface UseTransactionsProps {
  buildViewTransactions: (list: TransactionType[]) => ViewTransactionsType[]
  buildValuesTransactions: (list: TransactionType[]) => ViewValuesTransactionsType
  getNameMonthCurrentFilter: (filter: FilterTransactionType) => string
}

const useTransactions = (): UseTransactionsProps => {
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

  const getNameMonthCurrentFilter = (filter: FilterTransactionType): string => {
    const currentDate = new Date()
    const currentMonthNumber = getMonth(currentDate)

    if (filter.startDate !== '') {
      const date = new Date(filter.startDate)

      if (currentMonthNumber === getMonth(date)) {
        return 'Neste mês:'
      }

      return `Em <b>${LABEL_MONTHS[getMonth(date)]} de ${getYear(date)}</b>: `
    }

    return ''
  }

  return { buildViewTransactions, buildValuesTransactions, getNameMonthCurrentFilter }
}

export default useTransactions
