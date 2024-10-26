export type SegmentTransactionType = 'Receita' | 'Despesa' | 'Lembrete'

export type TransactionType = {
  id?: string
  idCategory: string
  value: number
  description: string
  segment?: SegmentTransactionType
  date?: Date
  name?: string
  color?: string
  createdAt?: Date
}

export type FilterTransactionType = {
  term: string
  category: string
  segment: string
  startDate: string
  endDate: string
  page: number
  take: number
}

export type TransactionsResponseType = {
  data: TransactionType[]
  page: number
  pageSize: number
  count: number
}

export type TotalTransactionType = {
  Total: number
}

export type TotalTransactionDashType = {
  TotalDespesa: number
  TotalReceita: number
  TotalGeral: number
}

export type TotalTransactionByCategoryType = {
  categoryName: string
  segment: SegmentTransactionType
  color: string
  total: number
}
