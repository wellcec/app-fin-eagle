/* eslint-disable @typescript-eslint/no-var-requires */

const { ipcRenderer } = require('electron')

interface IStartup {
  startDatabase: () => Promise<void>
}

const startup = (): IStartup => {
  const startDatabase = async (): Promise<void> => {
    try {
      const startQuery: string[] = [`
        CREATE TABLE IF NOT EXISTS "Categories" (
        "id" VARCHAR(36) NOT NULL,
        "name" VARCHAR(50) NOT NULL,
        "segment" VARCHAR(10) NOT NULL,
        "color" VARCHAR(20) NOT NULL DEFAULT '',
        "isGoal" INTEGER NOT NULL DEFAULT 0,
        "valueGoal" REAL NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT '',
        "updatedAt" DATETIME NOT NULL DEFAULT ''
        );`,
        `CREATE TABLE IF NOT EXISTS "Schedules" (
        "id" VARCHAR(36) NOT NULL,
        "title" VARCHAR(200) NULL,
        "description" VARCHAR(600) NULL,
        "segment" VARCHAR(50) NULL,
        "date" DATE NOT NULL,
        "createdAt" DATETIME NOT NULL,
        "isRecurrent" INTEGER NOT NULL
        );`,
        `CREATE TABLE IF NOT EXISTS "Transactions"(
        "id" VARCHAR(36) NOT NULL,
        "idCategory" VARCHAR(36) NOT NULL,
        "value" REAL NOT NULL DEFAULT 0,
        "description" VARCHAR(250) NOT NULL,
        "date" DATETIME NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT 0
        );`,
        `CREATE TABLE IF NOT EXISTS "Limits" (
        "id" VARCHAR(36) NOT NULL,
        "idCategory" VARCHAR(36) NOT NULL,
        "limitAmount" REAL NOT NULL DEFAULT 0,
        "period" VARCHAR(50) NOT NULL DEFAULT '0',
        "createdAt" DATETIME NULL DEFAULT NULL,
        "updatedAt" DATETIME NULL DEFAULT NULL
        );`,
        `CREATE TABLE IF NOT EXISTS "users"(
        "id" VARCHAR(36) NOT NULL,
        "idSerie" VARCHAR(36) NOT NULL,
        "name" VARCHAR(250) NOT NULL,
        "email" VARCHAR(250) NOT NULL,
        "document" VARCHAR(11) NOT NULL,
        "password" VARCHAR(50) NOT NULL,
        "isAdmin" TINYINT NOT NULL,
        "createdAt" DATETIME NOT NULL,
        "updatedAt" DATETIME NOT NULL
      );`
      ]

      for (const query of startQuery) {
        // await ipcRenderer.invoke('db-query', query)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {
    startDatabase
  }
}

export default startup
