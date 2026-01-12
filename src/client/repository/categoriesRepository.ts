/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Guid } from 'guid-typescript'
import { format } from 'date-fns'

import { CategoryType } from '../models/categories'
import { DEFAULT_FORMAT_DATE, DefaultsSegments } from '~/constants'

const { ipcRenderer } = require('electron')

export type GoalWithProgressType = CategoryType & {
  currentAmount: number
  percentageProgress: number
  isAchieved: boolean
}

export type GoalDebitProgressType = CategoryType & {
  currentInstallments: number
  valueTotal: number
  valuePaid: number
  percentageProgress: number
  isAchieved: boolean
}

interface ICategoriesRepository {
  getCategories: (name?: string) => Promise<CategoryType[]>
  createCategory: (category: CategoryType) => Promise<boolean>
  deleteCategory: (id: string) => Promise<boolean>
  getGoalsWithProgress: () => Promise<GoalWithProgressType[]>
  getDebitsWithProgress: () => Promise<GoalDebitProgressType[]>
}

const categoriesRepository = (): ICategoriesRepository => {
  const getCategories = async (name?: string): Promise<CategoryType[]> => {
    try {
      let filter = ''

      if (name && name !== '') {
        filter = ` AND name LIKE '%${name}%' OR segment LIKE '%${name}%'`
      }

      const orderBy = ' ORDER BY segment DESC, name ASC '

      const rows: CategoryType[] = await ipcRenderer.invoke('db-query', `SELECT * FROM Categories WHERE 1=1 ${filter} ${orderBy}`)
      return rows
    } catch (error) {
      return []
    }
  }

  const createCategory = async (category: CategoryType): Promise<boolean> => {
    try {
      const date = new Date()

      const query = `
      INSERT INTO Categories (id, name, segment, color, isGoal, valueGoal, installments, createdAt, updatedAt)
      VALUES (
        '${Guid.create()}',
        '${category.name}',
        '${category.segment}',
        '${category.color}',
        '${category.isGoal}',
        ${category.valueGoal ? `${category.valueGoal}` : 'NULL'},
        ${category.installments ? `${category.installments}` : 'NULL'},
        '${format(date, DEFAULT_FORMAT_DATE)}',
        '${format(date, DEFAULT_FORMAT_DATE)}'
      )
    `

      await ipcRenderer.invoke('db-query', query)

      return true
    } catch (error) {
      return false
    }
  }

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      const query = `DELETE FROM Categories WHERE id = '${id}'`

      await ipcRenderer.invoke('db-query', query)

      return true
    } catch (error) {
      return false
    }
  }

  const getGoalsWithProgress = async (): Promise<GoalWithProgressType[]> => {
    try {
      const query = `
        SELECT 
          c.id,
          c.name,
          c.segment,
          c.color,
          c.isGoal,
          c.valueGoal,
          c.createdAt,
          c.updatedAt,
          COALESCE(SUM(t.value), 0) as currentAmount
        FROM Categories c
        LEFT JOIN Transactions t ON t.idCategory = c.id 
          AND c.segment = '${DefaultsSegments.Expense}'
        WHERE 
          c.isGoal = 1
        GROUP BY c.id, c.name, c.segment, c.color, c.isGoal, c.valueGoal, c.createdAt, c.updatedAt
        ORDER BY c.name
      `

      const rows: any[] = await ipcRenderer.invoke('db-query', query)

      return rows.map(row => ({
        ...row,
        percentageProgress: row.valueGoal > 0 ? (row.currentAmount / row.valueGoal) * 100 : 0,
        isAchieved: row.currentAmount >= row.valueGoal
      }))
    } catch (error) {
      console.error('Error getting goals with progress:', error)
      return []
    }
  }

  const getDebitsWithProgress = async (): Promise<GoalDebitProgressType[]> => {
    try {
      const query = `
        SELECT 
          c.id,
          c.name,
          c.segment,
          c.color,
          c.isGoal,
          c.valueGoal,
          c.installments,
          c.createdAt,
          c.updatedAt,
          COALESCE(COUNT(t.id), 0) as currentInstallments
        FROM Categories c
        LEFT JOIN Transactions t ON t.idCategory = c.id 
          AND c.segment = '${DefaultsSegments.Expense}'
        WHERE 
          c.isGoal = 2
        GROUP BY c.id, c.name, c.segment, c.color, c.isGoal, c.valueGoal, c.createdAt, c.updatedAt
        ORDER BY c.name
      `

      const rows: any[] = await ipcRenderer.invoke('db-query', query)

      return rows.map((row) => {
        const percentage = row.currentInstallments > 0 ? (row.currentInstallments / row.installments) * 100 : 0

        return ({
          ...row,
          valueTotal: row.installments * row.valueGoal,
          valuePaid: row.currentInstallments * row.valueGoal,
          percentageProgress: row.currentInstallments === row.installments ? 100 : percentage,
          isAchieved: row.currentAmount >= row.valueGoal
        })
      })
    } catch (error) {
      console.error('Error getting debits with progress:', error)
      return []
    }
  }

  return {
    getCategories,
    createCategory,
    deleteCategory,
    getGoalsWithProgress,
    getDebitsWithProgress
  }
}

export default categoriesRepository
