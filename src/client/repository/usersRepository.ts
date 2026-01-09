/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-var-requires */

import { HASH } from '~/constants/auth'
import { UsersType } from '../models/users'
import { Guid } from 'guid-typescript'

const { ipcRenderer } = require('electron')

interface UserRepository {
  createUser: (user: UsersType) => Promise<UsersType | null>
  getUser: (password: string) => Promise<UsersType>
  getCountUsers: () => Promise<number>
}

const usersRepository = (): UserRepository => {
  const createUser = async (user: UsersType): Promise<UsersType | null> => {
    try {
      const hashPassword = btoa(`${HASH}:${user.password}`)

      const newUser: UsersType = {
        id: Guid.create().toString(),
        password: hashPassword,
        name: user.name
      }

      const query = `
      INSERT INTO users (id, name, password)
      VALUES (
        '${newUser.id}',
        '${newUser.name}',
        '${newUser.password}'
      )
    `

      await ipcRenderer.invoke('db-query', query)

      return newUser
    } catch (error) {
      return null
    }
  }

  const getUser = async (password: string): Promise<UsersType> => {
    const hashPassword = btoa(`${HASH}:${password}`)

    const rows: UsersType[] = await ipcRenderer.invoke('db-query', `SELECT * FROM users WHERE password = '${hashPassword}'`)
    return rows[0]
  }

  const getCountUsers = async (): Promise<number> => {
    const rows = await ipcRenderer.invoke('db-query', 'SELECT COUNT(*) as Count FROM users')
    return rows[0].Count
  }

  return {
    createUser,
    getUser,
    getCountUsers
  }
}

export default usersRepository
