/* eslint-disable n/handle-callback-err */
/* eslint-disable promise/param-names */
/* eslint-disable no-undef */

import { app, BrowserWindow, ipcMain } from 'electron'
import { createFileRoute, createURLRoute } from 'electron-router-dom'
import path from 'path'

import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('./database.db')

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
  "isGoal" INTEGER NOT NULL DEFAULT 0,
  "valueGoal" REAL NOT NULL DEFAULT 0,
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

if (require('electron-squirrel-startup'))
  app.quit()

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    titleBarStyle: 'default',
    resizable: true,
    autoHideMenuBar: true,
    center: true,
    roundedCorners: true, // Cantos arredondados (Windows 11)
    icon: path.join(__dirname, '../src/assets/images/logogranna.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }

    // skipTaskbar: true, // Oculta icone do aplicativo na barra de tarefas
    // frame: false, // Remove a barra de título padrão
    // transparent: true, // Permite fundo transparente
    // backgroundColor: '#00000000', // Fundo transparente
  })

  const devServerURL = createURLRoute(MAIN_WINDOW_VITE_DEV_SERVER_URL, 'main')

  const fileRoute = createFileRoute(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`), 'main')

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(devServerURL)
  } else {
    mainWindow.loadFile(...fileRoute)
  }

  mainWindow.on('closed', () => {
    app.quit()
  })

  ipcMain.handle('db-query', async (_, sqlQuery) => {
    return await new Promise(res => {
      db.all(sqlQuery, (_, rows) => {
        res(rows)
      })
    })
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => { app.quit() })

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0)
    createWindow()
})
