import { endOfMonth, format, startOfMonth } from 'date-fns'
import { FilterTransactionType } from '~/client/models/transactions'
import { DEFAULT_FORMAT_DATE, DEFAULT_OVER_PAGESIZE } from '.'
import { CategoryTypeEnum } from './categories'

export const emptyFilter: FilterTransactionType = {
  term: '',
  page: 1,
  take: DEFAULT_OVER_PAGESIZE,
  category: '',
  endDate: format(endOfMonth(new Date()), DEFAULT_FORMAT_DATE),
  startDate: format(startOfMonth(new Date()), DEFAULT_FORMAT_DATE),
  segment: '',
  isGoal: CategoryTypeEnum.Default
}
