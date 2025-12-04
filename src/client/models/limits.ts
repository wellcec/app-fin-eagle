export type LimitType = {
  id?: string
  idCategory: string
  limitAmount: number
  period: string
  createdAt?: Date
  updatedAt?: Date
}

export type LimitWithCategoryType = {
  id?: string
  idCategory: string
  limitAmount: number
  period: string
  categoryName: string
  categoryColor: string
  currentSpending: number
  percentageUsed: number
  isExceeded: boolean
  createdAt?: Date
  updatedAt?: Date
}

export type ExceededLimitType = {
  id: string
  categoryName: string
  categoryColor: string
  limitAmount: number
  currentSpending: number
  overage: number
  percentageUsed: number
}
