/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-var-requires */

import { Guid } from 'guid-typescript'
import { format } from 'date-fns'
import { DEFAULT_FORMAT_DATE, DEFAULT_SHORT_FORMAT_DATE } from '~/constants'
import { SchedulesResponseType, ScheduleType } from '../models/schedules'

const { ipcRenderer } = require('electron')

interface ISchedulesRepository {
  getSchedulesByDay: (date: Date) => Promise<SchedulesResponseType>
  getSchedulesByRange: (startDate: Date, endDate: Date) => Promise<SchedulesResponseType>
  createSchedule: (schedule: ScheduleType) => Promise<boolean>
  deleteSchedule: (id: string) => Promise<boolean>
}

const schedulesRepository = (): ISchedulesRepository => {
  const getSchedulesByDay = async (date: Date): Promise<SchedulesResponseType> => {
    try {
      const formattedDate = format(date, DEFAULT_SHORT_FORMAT_DATE)
      const day = formattedDate.split('-')

      const query = `
        SELECT 
          *
        FROM Schedules
        WHERE 
          date = '${formattedDate}' OR (isRecurrent = 1 AND strftime('%d', date) = '${day[2]}')
        ORDER BY date DESC
      `

      const rows: ScheduleType[] = await ipcRenderer.invoke('db-query', query)

      return {
        page: 1,
        pageSize: 1000,
        count: rows.length,
        data: rows
      }
    } catch (error) {
      console.error(error)

      return {
        page: 1,
        pageSize: 1,
        count: 1,
        data: []
      }
    }
  }

  const getSchedulesByRange = async (startDate: Date, endDate: Date): Promise<SchedulesResponseType> => {
    try {
      const formattedStartDate = format(startDate, DEFAULT_FORMAT_DATE)
      const formattedEndDate = format(endDate, DEFAULT_FORMAT_DATE)

      const query = `
        SELECT 
          *
        FROM Schedules
        WHERE 
          (date BETWEEN '${formattedStartDate}' AND '${formattedEndDate}') OR isRecurrent = 1
        ORDER BY date DESC
      `

      const rows: ScheduleType[] = await ipcRenderer.invoke('db-query', query)

      return {
        page: 1,
        pageSize: 1000,
        count: rows.length,
        data: rows
      }
    } catch (error) {
      console.error(error)

      return {
        page: 1,
        pageSize: 1,
        count: 1,
        data: []
      }
    }
  }

  const createSchedule = async (schedule: ScheduleType): Promise<boolean> => {
    try {
      const date = new Date()

      const query = `
      INSERT INTO Schedules (id, title, description, segment, isRecurrent, date, createdAt)
      VALUES (
        '${Guid.create()}',
        '${schedule.title}',
        '${schedule.description}',
        '${schedule.segment}',
        '${schedule.isRecurrent}',
        '${format(schedule.date ?? date, DEFAULT_SHORT_FORMAT_DATE)}',
        '${format(date, DEFAULT_FORMAT_DATE)}'
      )
    `

      await ipcRenderer.invoke('db-query', query)

      return true
    } catch (error) {
      return false
    }
  }

  const deleteSchedule = async (id: string): Promise<boolean> => {
    try {
      const query = `DELETE FROM Schedules WHERE id = '${id}'`

      await ipcRenderer.invoke('db-query', query)

      return true
    } catch (error) {
      return false
    }
  }

  return {
    getSchedulesByDay,
    getSchedulesByRange,
    createSchedule,
    deleteSchedule
  }
}

export default schedulesRepository
