import { SegmentTransactionType } from './transactions'

export type CategoryType = {
  id?: string
  name: string
  segment: SegmentTransactionType
  color: string
  createdAt?: Date
  updatedAt?: Date
}
