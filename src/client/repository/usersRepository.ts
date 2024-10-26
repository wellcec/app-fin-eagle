/* eslint-disable @typescript-eslint/no-var-requires */

import { UsersType } from '../models/users'

const { ipcRenderer } = require('electron')

const usersRepository = () => {
  const getUsers = async (): Promise<UsersType[]> => {
    const rows: UsersType[] = await ipcRenderer.invoke('db-query', 'SELECT * FROM Users')
    return rows
  }

  return {
    getUsers
  }
}

export default usersRepository
