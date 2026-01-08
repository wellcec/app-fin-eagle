import { SegmentTransactionType } from './transactions'

export type CategoryType = {
  id?: string
  name: string
  segment: SegmentTransactionType
  color: string
  isGoal: number
  valueGoal?: number
  installments?: number
  createdAt?: Date
  updatedAt?: Date
}
