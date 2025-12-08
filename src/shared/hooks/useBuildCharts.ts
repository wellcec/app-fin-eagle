import { compareAsc, getMonth } from 'date-fns'
import { SegmentTransactionType, TransactionType } from '~/client/models/transactions'
import { DefaultsSegments, Segments } from '~/constants'
import { BuildChartSimplePieType, BuildChartSimpleType, ChartSimpleType, SimpleBarChartResponseType, SimplePieChartResponseType } from '~/models/charts'

interface IUtils {
  buildSimpleChart: (buildTransactions: TransactionType[]) => SimpleBarChartResponseType
  buildSimplePieChartByMonth: (buildTransactions: TransactionType[]) => SimplePieChartResponseType
}

const useBuildCharts = (): IUtils => {
  const buildSimpleChart = (buildTransactions: TransactionType[]): SimpleBarChartResponseType => {
    const monthsInChart: BuildChartSimpleType[] = []
    const builtInChart: ChartSimpleType[] = []

    buildTransactions = buildTransactions.sort((a, b) => {
      if (!a.date || !b.date) return 0
      return compareAsc(a.date, b.date)
    })

    for (const transaction of buildTransactions) {
      const isExpense = transaction.segment === DefaultsSegments.Expense
      const isReceive = transaction.segment === DefaultsSegments.Receive
      const date = transaction.date ?? new Date()
      const month = getMonth(date)

      const currentMonth = monthsInChart.find(m => m.month === month)
      if (!currentMonth) {
        const monthToAdd: BuildChartSimpleType = {
          month,
          Expense: isExpense ? transaction.value : 0,
          Receive: isReceive ? transaction.value : 0
        }

        monthsInChart.push(monthToAdd)
      } else {
        const monthIndex = monthsInChart.indexOf(currentMonth)
        monthsInChart[monthIndex].Expense += isExpense ? transaction.value : 0
        monthsInChart[monthIndex].Receive += isReceive ? transaction.value : 0
      }
    }

    const keysType = Object.keys(Segments) as SegmentTransactionType[]

    for (const key of keysType) {
      if (key === DefaultsSegments.Expense) {
        const buildChart: ChartSimpleType = {
          label: Segments.Despesa.title,
          data: monthsInChart.map(x => x.Expense)
        }

        builtInChart.push(buildChart)
      }

      if (key === DefaultsSegments.Receive) {
        const buildChart: ChartSimpleType = {
          label: Segments.Receita.title,
          data: monthsInChart.map(x => x.Receive)
        }

        builtInChart.push(buildChart)
      }
    }

    return {
      builtInChart,
      monthsInChart
    }
  }

  const buildSimplePieChartByMonth = (buildTransactions: TransactionType[]): SimplePieChartResponseType => {
    const getTransactionsFiltered = (current: TransactionType[]): BuildChartSimplePieType[] => {
      const pieChartData: BuildChartSimplePieType[] = []

      for (const transaction of current) {
        const currentChart = pieChartData.find(p => p.label === transaction.name)
        if (!currentChart) {
          const categoryToAdd: BuildChartSimplePieType = {
            id: pieChartData.length,
            color: transaction.color ?? '',
            label: transaction.name ?? '',
            value: transaction.value
          }

          pieChartData.push(categoryToAdd)
        } else {
          const chartIndex = pieChartData.indexOf(currentChart)
          pieChartData[chartIndex].value += transaction.value
        }
      }

      return pieChartData
    }

    return {
      expense: getTransactionsFiltered(buildTransactions.filter(t => t.segment === DefaultsSegments.Expense)),
      receive: getTransactionsFiltered(buildTransactions.filter(t => t.segment === DefaultsSegments.Receive))
    }
  }

  return {
    buildSimpleChart,
    buildSimplePieChartByMonth
  }
}

export default useBuildCharts
