/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Guid } from 'guid-typescript'
import { format, startOfMonth, endOfMonth } from 'date-fns'

import { LimitType, LimitWithCategoryType, ExceededLimitType } from '../models/limits'
import { DEFAULT_FORMAT_DATE, DefaultsSegments } from '~/constants'

const { ipcRenderer } = require('electron')

interface ILimitsRepository {
  getLimits: () => Promise<LimitWithCategoryType[]>
  getLimitByCategory: (categoryId: string) => Promise<LimitType | undefined>
  createLimit: (limit: LimitType) => Promise<boolean>
  updateLimit: (limit: LimitType) => Promise<boolean>
  deleteLimit: (id: string) => Promise<boolean>
  checkExceededLimits: () => Promise<ExceededLimitType[]>
}

const limitsRepository = (): ILimitsRepository => {
  const getLimits = async (): Promise<LimitWithCategoryType[]> => {
    try {
      const currentDate = new Date()
      const startDate = startOfMonth(currentDate)
      const endDate = endOfMonth(currentDate)
      const formattedStartDate = format(startDate, DEFAULT_FORMAT_DATE)
      const formattedEndDate = format(endDate, DEFAULT_FORMAT_DATE)

      const query = `
        SELECT 
          l.id,
          l.idCategory,
          l.limitAmount,
          l.period,
          l.createdAt,
          l.updatedAt,
          c.name as categoryName,
          c.color as categoryColor,
          COALESCE(SUM(t.value), 0) as currentSpending
        FROM Limits l
        INNER JOIN Categories c ON l.idCategory = c.id
        LEFT JOIN Transactions t ON t.idCategory = l.idCategory 
          AND t.date BETWEEN '${formattedStartDate}' AND '${formattedEndDate}'
          AND c.segment = '${DefaultsSegments.Expense}
        GROUP BY l.id, l.idCategory, l.limitAmount, l.period, c.name, c.color
        ORDER BY c.name
      `

      const rows: any[] = await ipcRenderer.invoke('db-query', query)

      return rows.map(row => ({
        ...row,
        percentageUsed: row.limitAmount > 0 ? (row.currentSpending / row.limitAmount) * 100 : 0,
        isExceeded: row.currentSpending > row.limitAmount
      }))
    } catch (error) {
      console.error('Error getting limits:', error)
      return []
    }
  }

  const getLimitByCategory = async (categoryId: string): Promise<LimitType | undefined> => {
    try {
      const query = `SELECT * FROM Limits WHERE idCategory = '${categoryId}'`
      const rows: LimitType[] = await ipcRenderer.invoke('db-query', query)
      return rows.length > 0 ? rows[0] : undefined
    } catch (error) {
      console.error('Error getting limit by category:', error)
      return undefined
    }
  }

  const createLimit = async (limit: LimitType): Promise<boolean> => {
    try {
      const date = new Date()

      const query = `
        INSERT INTO Limits (id, idCategory, limitAmount, period, createdAt, updatedAt)
        VALUES (
          '${Guid.create()}',
          '${limit.idCategory}',
          ${limit.limitAmount},
          '${limit.period}',
          '${format(date, DEFAULT_FORMAT_DATE)}',
          '${format(date, DEFAULT_FORMAT_DATE)}'
        )
      `

      await ipcRenderer.invoke('db-query', query)
      return true
    } catch (error) {
      console.error('Error creating limit:', error)
      return false
    }
  }

  const updateLimit = async (limit: LimitType): Promise<boolean> => {
    try {
      const date = new Date()

      const query = `
        UPDATE Limits 
        SET 
          limitAmount = ${limit.limitAmount},
          period = '${limit.period}',
          updatedAt = '${format(date, DEFAULT_FORMAT_DATE)}'
        WHERE id = '${limit.id}'
      `

      await ipcRenderer.invoke('db-query', query)
      return true
    } catch (error) {
      console.error('Error updating limit:', error)
      return false
    }
  }

  const deleteLimit = async (id: string): Promise<boolean> => {
    try {
      const query = `DELETE FROM Limits WHERE id = '${id}'`
      await ipcRenderer.invoke('db-query', query)
      return true
    } catch (error) {
      console.error('Error deleting limit:', error)
      return false
    }
  }

  const checkExceededLimits = async (): Promise<ExceededLimitType[]> => {
    try {
      const currentDate = new Date()
      const startDate = startOfMonth(currentDate)
      const endDate = endOfMonth(currentDate)
      const formattedStartDate = format(startDate, DEFAULT_FORMAT_DATE)
      const formattedEndDate = format(endDate, DEFAULT_FORMAT_DATE)

      const query = `
        SELECT 
          l.id,
          c.name as categoryName,
          c.color as categoryColor,
          l.limitAmount,
          COALESCE(SUM(t.value), 0) as currentSpending
        FROM Limits l
        INNER JOIN Categories c ON l.idCategory = c.id
        LEFT JOIN Transactions t ON t.idCategory = l.idCategory AND t.date BETWEEN '${formattedStartDate}' AND '${formattedEndDate}' AND c.segment = '${DefaultsSegments.Expense}'
        GROUP BY l.id, c.name, c.color, l.limitAmount
        HAVING currentSpending > l.limitAmount
        ORDER BY (currentSpending - l.limitAmount) DESC
      `

      const rows: any[] = await ipcRenderer.invoke('db-query', query)

      return rows.map(row => ({
        ...row,
        overage: row.currentSpending - row.limitAmount,
        percentageUsed: (row.currentSpending / row.limitAmount) * 100
      }))
    } catch (error) {
      console.error('Error checking exceeded limits:', error)
      return []
    }
  }

  return {
    getLimits,
    getLimitByCategory,
    createLimit,
    updateLimit,
    deleteLimit,
    checkExceededLimits
  }
}

export default limitsRepository
