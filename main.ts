/* eslint-disable n/handle-callback-err */
/* eslint-disable promise/param-names */
/* eslint-disable no-undef */

import { app, BrowserWindow, ipcMain } from 'electron'
import { createFileRoute, createURLRoute } from 'electron-router-dom'
import path from 'path'

import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('./database.db')

// Initialize database tables
db.serialize(() => {
  db.run(`
  /*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para database
-- CREATE DATABASE IF NOT EXISTS "database";

-- Copiando estrutura para tabela database.Categories
  CREATE TABLE IF NOT EXISTS "Categories" (
  "id" VARCHAR(36) NOT NULL,
  "name" VARCHAR(50) NOT NULL,
  "segment" VARCHAR(10) NOT NULL,
  "color" VARCHAR(20) NOT NULL DEFAULT '',
  "createdAt" DATETIME NOT NULL DEFAULT '',
  "updatedAt" DATETIME NOT NULL DEFAULT ''
  );

  -- Exportação de dados foi desmarcado.

  -- Copiando estrutura para tabela database.Limits
  CREATE TABLE IF NOT EXISTS "Limits" (
  "id" VARCHAR(36) NOT NULL,
  "idCategory" VARCHAR(36) NOT NULL,
  "limitAmount" REAL NOT NULL DEFAULT 0,
  "period" VARCHAR(50) NOT NULL DEFAULT '0',
  "createdAt" DATETIME NULL DEFAULT NULL,
  "updatedAt" DATETIME NULL DEFAULT NULL
  );

  -- Exportação de dados foi desmarcado.

  -- Copiando estrutura para tabela database.Schedules
  CREATE TABLE IF NOT EXISTS "Schedules" (
  "id" VARCHAR(36) NOT NULL,
  "title" VARCHAR(200) NULL,
  "description" VARCHAR(600) NULL,
  "segment" VARCHAR(50) NULL,
  "date" DATE NOT NULL,
  "createdAt" DATETIME NOT NULL,
  "isRecurrent" INTEGER NOT NULL
  );

  -- Exportação de dados foi desmarcado.

  -- Copiando estrutura para tabela database.Transactions
  CREATE TABLE IF NOT EXISTS "Transactions" (
  "id" VARCHAR(36) NOT NULL,
  "idCategory" VARCHAR(36) NOT NULL,
  "value" REAL NOT NULL DEFAULT 0,
  "description" VARCHAR(250) NOT NULL,
  "date" DATETIME NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT 0
  );

  -- Exportação de dados foi desmarcado.

  -- Copiando estrutura para tabela database.users
  CREATE TABLE IF NOT EXISTS "users" (
  "id" VARCHAR(36) NOT NULL,
  "idSerie" VARCHAR(36) NOT NULL,
  "name" VARCHAR(250) NOT NULL,
  "email" VARCHAR(250) NOT NULL,
  "document" VARCHAR(11) NOT NULL,
  "password" VARCHAR(50) NOT NULL,
  "isAdmin" TINYINT NOT NULL,
  "createdAt" DATETIME NOT NULL,
  "updatedAt" DATETIME NOT NULL
  );

  -- Exportação de dados foi desmarcado.

  /*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
  /*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
  /*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
  /*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
  /*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
  `)
})

// Handle creating/removing shortcuts on Windows when installing/uninstalling.

if (require('electron-squirrel-startup')) {
  app.quit()
}

const createWindow = (): void => {
  // Create the browser window.

  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    skipTaskbar: true,
    autoHideMenuBar: true,
    icon: path.join(__dirname, '../src/assets/images/logogranna.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    },

    darkTheme: true,
    center: true
  })
  // and load the index.html of the app.

  const devServerURL = createURLRoute(MAIN_WINDOW_VITE_DEV_SERVER_URL, 'main')

  const fileRoute = createFileRoute(
    path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    'main'
  )

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(devServerURL)
  } else {
    mainWindow.loadFile(...fileRoute)
  }

  ipcMain.handle('db-query', async (event, sqlQuery) => {
    return await new Promise(res => {
      db.all(sqlQuery, (err, rows) => {
        res(rows)
      })
    })
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.on('ready', createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
