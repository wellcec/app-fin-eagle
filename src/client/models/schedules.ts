import { SegmentTransactionType } from './transactions'

export type ScheduleType = {
  id?: string
  title: string
  description: string
  segment: SegmentTransactionType
  date?: Date
  isRecurrent?: number
  createdAt?: Date
}

export type SchedulesResponseType = {
  data: ScheduleType[]
  page: number
  pageSize: number
  count: number
}

export type TotalScheduleType = {
  Total: number
}
