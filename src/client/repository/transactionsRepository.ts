/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-var-requires */

import { Guid } from 'guid-typescript'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { DEFAULT_FORMAT_DATE, DefaultsSegments } from '~/constants'
import { FilterTransactionType, TotalTransactionByCategoryType, TotalTransactionDashType, TotalTransactionType, TransactionsResponseType, TransactionType } from '../models/transactions'
import { CategoryTypeEnum } from '~/constants/categories'

const { ipcRenderer } = require('electron')

interface ITransactionRepository {
  getAllTransactions: () => Promise<TotalTransactionDashType>
  getTransactions: (filter: FilterTransactionType) => Promise<TransactionsResponseType>
  createTransaction: (transaction: TransactionType) => Promise<boolean>
  deleteTransaction: (id: string) => Promise<boolean>
  transactionByCategory: (categoryId?: string) => Promise<number>
  transactionByBankAccount: (bankAccountId: string) => Promise<number>
  getTotalByCategory: () => Promise<TotalTransactionByCategoryType[]>
  getTopExpenses: (month: Date) => Promise<TransactionType[]>
}

const transactionsRepository = (): ITransactionRepository => {
  const getTransactions = async (filter: FilterTransactionType): Promise<TransactionsResponseType> => {
    try {
      const { term, category, segment, isGoal, page, take } = filter
      const offset = (page - 1) * take

      const _term = term !== '' ? ` AND (t.description LIKE '%${term}%' OR t.description LIKE '%${term}%' OR c.name LIKE '%${term}%' OR b.name LIKE '%${term}%') ` : ''
      const _category = category !== '' ? ` AND t.idCategory = '${category}'` : ''
      const _segment = segment !== '' ? ` AND c.Segment = '${segment}'` : ''

      const allExpenseCategoriesFilter = ` ${isGoal === CategoryTypeEnum.Default ? ` AND c.isGoal <> ${CategoryTypeEnum.Goal} ` : ` AND c.isGoal = ${isGoal}`} `
      const _isGoal = isGoal !== undefined ? allExpenseCategoriesFilter : ''

      const formattedStartDate = format(filter.startDate, DEFAULT_FORMAT_DATE)
      const formattedEndDate = format(filter.endDate, DEFAULT_FORMAT_DATE)
      const _datefilter = ` AND t.date BETWEEN '${formattedStartDate}' AND '${formattedEndDate}'`

      const query = `
        SELECT 
          t.id,
          t.idCategory,
          t.value,
          t.description,
          t.date,
          c.segment,
          c.name,
          c.color,
          c.isGoal,
          c.valueGoal,
          b.name as bankName,
          b.color as bankColor,
          t.createdAt
        FROM Transactions t
        INNER JOIN Categories c ON t.idCategory = c.id
        INNER JOIN BankAccounts b ON t.idBankAccount = b.id
        WHERE 
          1=1
          ${_datefilter}
          ${_segment}
          ${_isGoal}
          ${_term}
          ${_category}
        ORDER BY  t.date DESC
        LIMIT ${take} OFFSET ${offset}
      `

      const queryCount = `
        SELECT Count(*) as Total FROM Transactions t
        INNER JOIN Categories c ON t.idCategory = c.id
        INNER JOIN BankAccounts b ON t.idBankAccount = b.id
        WHERE 
          1=1
          ${_datefilter}
          ${_segment}
          ${_isGoal}
          ${_term}
          ${_category}
      `
      const count: TotalTransactionType[] = await ipcRenderer.invoke('db-query', queryCount)
      const rows: TransactionType[] = await ipcRenderer.invoke('db-query', query)

      return {
        page,
        pageSize: take,
        count: count[0].Total,
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

  const createTransaction = async (transaction: TransactionType): Promise<boolean> => {
    try {
      const date = new Date()

      const query = `
      INSERT INTO Transactions (id, idCategory, value, description, idBankAccount, date, createdAt)
      VALUES (
        '${Guid.create()}',
        '${transaction.idCategory}',
        '${transaction.value}',
        '${transaction.description}',
        '${transaction.idBankAccount}',
        '${format(transaction.date ?? date, DEFAULT_FORMAT_DATE)}',
        '${format(date, DEFAULT_FORMAT_DATE)}'
      )
    `

      await ipcRenderer.invoke('db-query', query)

      return true
    } catch (error) {
      return false
    }
  }

  const deleteTransaction = async (id: string): Promise<boolean> => {
    try {
      const query = `DELETE FROM Transactions WHERE id = '${id}'`

      await ipcRenderer.invoke('db-query', query)

      return true
    } catch (error) {
      return false
    }
  }

  const transactionByCategory = async (categoryId?: string): Promise<number> => {
    try {
      const queryCount = `SELECT Count(*) as Total FROM Transactions WHERE idCategory = '${categoryId}'`
      const count: TotalTransactionType[] = await ipcRenderer.invoke('db-query', queryCount)
      return count[0].Total
    } catch (error) {
      return 0
    }
  }

  const transactionByBankAccount = async (bankAccountId: string): Promise<number> => {
    try {
      const queryCount = `SELECT Count(*) as Total FROM Transactions WHERE idBankAccount = '${bankAccountId}'`
      const count: TotalTransactionType[] = await ipcRenderer.invoke('db-query', queryCount)
      return count[0].Total
    } catch (error) {
      return 0
    }
  }

  const getAllTransactions = async (): Promise<TotalTransactionDashType> => {
    try {
      const query = `
        SELECT 
            SUM(CASE WHEN c.segment = '${DefaultsSegments.Expense}' THEN t.value ELSE 0 END) AS TotalDespesa,
            SUM(CASE WHEN c.segment = '${DefaultsSegments.Receive}' THEN t.value ELSE 0 END) AS TotalReceita,
            SUM(CASE WHEN c.segment = '${DefaultsSegments.Receive}' THEN t.value ELSE -t.value END) AS TotalGeral
        FROM Transactions t
        INNER JOIN Categories c ON t.idCategory = c.id
        WHERE c.isGoal <> 1;
      `

      const data: TotalTransactionDashType[] = await ipcRenderer.invoke('db-query', query)

      return data[0]
    } catch (error) {
      console.error(error)

      return {
        TotalGeral: 0,
        TotalReceita: 0,
        TotalDespesa: 0
      }
    }
  }

  const getTotalByCategory = async (): Promise<TotalTransactionByCategoryType[]> => {
    try {
      const query = `
            SELECT 
                c.name AS categoryName,
                c.segment,
                c.color,
                SUM(t.value) AS total
            FROM Transactions t
            INNER JOIN Categories c ON t.idCategory = c.id
            WHERE c.isGoal = 0
            GROUP BY c.name, c.segment;
      `

      const data: TotalTransactionByCategoryType[] = await ipcRenderer.invoke('db-query', query)

      return data
    } catch (error) {
      console.error(error)

      return []
    }
  }

  const getTopExpenses = async (month: Date): Promise<TransactionType[]> => {
    try {
      const startOfMonthDate = format(startOfMonth(month), DEFAULT_FORMAT_DATE)
      const endOfMonthDate = format(endOfMonth(month), DEFAULT_FORMAT_DATE)

      const query = `
        SELECT 
          t.id,
          t.idCategory,
          t.value,
          t.description,
          c.segment,
          t.date,
          c.name,
          c.color,
          c.isGoal,
          c.valueGoal,
          t.createdAt
        FROM Transactions t
        INNER JOIN Categories c ON t.idCategory = c.id
        WHERE 
          c.Segment = 'Despesa'
          AND t.date BETWEEN '${startOfMonthDate}' AND '${endOfMonthDate}'
          AND c.isGoal = 0
        ORDER BY t.value DESC
        LIMIT 3
      `

      const rows: TransactionType[] = await ipcRenderer.invoke('db-query', query)

      return rows
    } catch (error) {
      console.error(error)
      return []
    }
  }

  return {
    getAllTransactions,
    getTransactions,
    createTransaction,
    deleteTransaction,
    transactionByCategory,
    transactionByBankAccount,
    getTotalByCategory,
    getTopExpenses
  }
}

export default transactionsRepository
