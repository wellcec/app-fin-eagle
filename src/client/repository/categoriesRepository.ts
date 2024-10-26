/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Guid } from 'guid-typescript'
import { format } from 'date-fns'

import { CategoryType } from '../models/categories'
import { DEFAULT_FORMAT_DATE } from '~/constants'

const { ipcRenderer } = require('electron')

interface ICategoriesRepository {
  getCategories: (name?: string) => Promise<CategoryType[]>
  createCategory: (category: CategoryType) => Promise<boolean>
  deleteCategory: (id: string) => Promise<boolean>
}

const categoriesRepository = (): ICategoriesRepository => {
  const getCategories = async (name?: string): Promise<CategoryType[]> => {
    try {
      let filter = ''

      if (name && name !== '') {
        filter = ` WHERE name LIKE '%${name}%' OR segment LIKE '%${name}%'`
      }

      const rows: CategoryType[] = await ipcRenderer.invoke('db-query', 'SELECT * FROM Categories' + filter)
      return rows
    } catch (error) {
      return []
    }
  }

  const createCategory = async (category: CategoryType): Promise<boolean> => {
    try {
      const date = new Date()

      const query = `
      INSERT INTO Categories (id, name, segment, color, createdAt, updatedAt)
      VALUES (
        '${Guid.create()}',
        '${category.name}',
        '${category.segment}',
        '${category.color}',
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

  return {
    getCategories,
    createCategory,
    deleteCategory
  }
}

export default categoriesRepository
