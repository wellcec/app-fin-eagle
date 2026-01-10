/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Guid } from 'guid-typescript'
import { format } from 'date-fns'

import { DEFAULT_FORMAT_DATE } from '~/constants'
import { BankAccountType } from '../models/bankAccounts'

const { ipcRenderer } = require('electron')

interface IBankAccountsRepository {
  getAccounts: (name?: string, limited?: boolean) => Promise<BankAccountType[]>
  createAccount: (category: BankAccountType) => Promise<boolean>
  deleteAccount: (id: string) => Promise<boolean>
}

const bankAccountsRepository = (): IBankAccountsRepository => {
  const getAccounts = async (name?: string, limited: boolean = false): Promise<BankAccountType[]> => {
    try {
      let filter = ''

      if (name && name !== '') {
        filter = ` AND name LIKE '%${name}%' `
      }

      const orderBy = ' ORDER BY b.name DESC '
      const limit = limited ? ' LIMIT 4 ' : ''

      const query = `
        SELECT
          b.id,
          b.color,
          b.name,
          SUM(
            CASE 
              WHEN c.segment = 'Receita' THEN t.value
              WHEN c.segment = 'Despesa' THEN -t.value
              ELSE 0
            END
          ) AS totalValue
        FROM Transactions t
        INNER JOIN Categories c ON t.idCategory = c.id
        INNER JOIN BankAccounts b ON t.idBankAccount = b.id
        WHERE 
          c.isGoal <> 1
          ${filter}
        GROUP BY b.id, b.name
        ${orderBy}
        ${limit};
      `

      const rows: BankAccountType[] = await ipcRenderer.invoke('db-query', query)
      return rows
    } catch (error) {
      return []
    }
  }

  const createAccount = async (account: BankAccountType): Promise<boolean> => {
    try {
      const date = new Date()

      const query = `
      INSERT INTO BankAccounts (id, name, color, createdAt)
      VALUES (
        '${Guid.create()}',
        '${account.name}',
        '${account.color}',
        '${format(date, DEFAULT_FORMAT_DATE)}'
      )
    `

      await ipcRenderer.invoke('db-query', query)

      return true
    } catch (error) {
      return false
    }
  }

  const deleteAccount = async (id: string): Promise<boolean> => {
    try {
      const query = `DELETE FROM BankAccounts WHERE id = '${id}'`

      await ipcRenderer.invoke('db-query', query)

      return true
    } catch (error) {
      return false
    }
  }

  return {
    getAccounts,
    createAccount,
    deleteAccount
  }
}

export default bankAccountsRepository
