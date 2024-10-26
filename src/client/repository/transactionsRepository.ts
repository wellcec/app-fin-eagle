/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-var-requires */

import { Guid } from 'guid-typescript'
import { format } from 'date-fns'
import { DEFAULT_FORMAT_DATE } from '~/constants'
import { FilterTransactionType, TotalTransactionByCategoryType, TotalTransactionDashType, TotalTransactionType, TransactionsResponseType, TransactionType } from '../models/transactions'

const { ipcRenderer } = require('electron')

interface ITransactionRepository {
  getAllTransactions: () => Promise<TotalTransactionDashType>
  getTransactions: (filter: FilterTransactionType) => Promise<TransactionsResponseType>
  createTransaction: (transaction: TransactionType) => Promise<boolean>
  deleteTransaction: (id: string) => Promise<boolean>
  transactionByCategory: (categoryId?: string) => Promise<number>
  getTotalByCategory: () => Promise<TotalTransactionByCategoryType[]>
}

const transactionsRepository = (): ITransactionRepository => {
  const getTransactions = async (filter: FilterTransactionType): Promise<TransactionsResponseType> => {
    try {
      const { term, category, segment, page, take } = filter
      const offset = (page - 1) * take

      const _description = term !== '' ? ` AND (t.description LIKE '%${term}%' OR t.description LIKE '%${term}%' OR c.name LIKE '%${term}%') ` : ''
      const _category = category !== '' ? ` AND t.idCategory = '${category}'` : ''
      const _segment = segment !== '' ? ` AND c.Segment = '${segment}'` : ''

      const formattedStartDate = format(filter.startDate, DEFAULT_FORMAT_DATE)
      const formattedEndDate = format(filter.endDate, DEFAULT_FORMAT_DATE)
      const _datefilter = ` t.date BETWEEN '${formattedStartDate}' AND '${formattedEndDate}'`

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
          t.createdAt
        FROM Transactions t
        INNER JOIN Categories c ON t.idCategory = c.id
        WHERE 
          ${_datefilter}
          ${_segment}
          ${_description}
          ${_category}
        ORDER BY  t.date DESC
        LIMIT ${take} OFFSET ${offset}
      `

      const queryCount = `
        SELECT Count(*) as Total FROM Transactions t
        INNER JOIN Categories c ON t.idCategory = c.id
        WHERE 
          ${_datefilter}
          ${_segment}
          ${_description}
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
      INSERT INTO Transactions (id, idCategory, value, description, date, createdAt)
      VALUES (
        '${Guid.create()}',
        '${transaction.idCategory}',
        '${transaction.value}',
        '${transaction.description}',
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

  const getAllTransactions = async (): Promise<TotalTransactionDashType> => {
    try {
      const query = `
        SELECT 
            SUM(CASE WHEN c.segment = 'Despesa' THEN t.value ELSE 0 END) AS TotalDespesa,
            SUM(CASE WHEN c.segment = 'Receita' THEN t.value ELSE 0 END) AS TotalReceita,
            SUM(t.value) AS TotalGeral
        FROM Transactions t
        INNER JOIN Categories c ON t.idCategory = c.id;
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
            GROUP BY c.name, c.segment
      `

      const data: TotalTransactionByCategoryType[] = await ipcRenderer.invoke('db-query', query)

      return data
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
    getTotalByCategory
  }
}

export default transactionsRepository
