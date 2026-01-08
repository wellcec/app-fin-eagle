/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-var-requires */

import { HASH } from '~/constants/auth'
import { UsersType } from '../models/users'

const { ipcRenderer } = require('electron')

interface UserRepository {
  getUser: (password: string) => Promise<UsersType>
}

const usersRepository = (): UserRepository => {
  const getUser = async (password: string): Promise<UsersType> => {
    const hashPassword = btoa(`${HASH}:${password}`)

    console.log(hashPassword)
    const rows: UsersType[] = await ipcRenderer.invoke('db-query', `SELECT * FROM users WHERE password = '${hashPassword}'`)
    return rows[0]
  }

  return {
    getUser
  }
}

export default usersRepository
