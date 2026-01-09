/* eslint-disable n/handle-callback-err */
/* eslint-disable promise/param-names */
/* eslint-disable no-undef */

import { app, BrowserWindow, ipcMain } from 'electron'
import { createFileRoute, createURLRoute } from 'electron-router-dom'
import path from 'path'

import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('./database.db')

if (require('electron-squirrel-startup')) {
  app.quit()
}

const createWindow = (): void => {
  const DEV_MODE: boolean = MAIN_WINDOW_VITE_DEV_SERVER_URL !== undefined || MAIN_WINDOW_VITE_DEV_SERVER_URL !== null

  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    titleBarStyle: 'hidden',
    resizable: true,
    autoHideMenuBar: true,
    center: true,
    roundedCorners: true, // Cantos arredondados (Windows 11)
    icon: path.join(__dirname, '../src/assets/images/logogranna.png'),
    webPreferences: {
      devTools: DEV_MODE,
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

  mainWindow.on('closed', () => { app.quit() })

  ipcMain.handle('db-query', async (_, sqlQuery) => {
    return await new Promise(res => {
      db.all(sqlQuery, (_, rows) => {
        res(rows)
      })
    })
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.webContents.on('before-input-event', (event, input) => {
      const forbidden =
        input.key === 'F12' ||
        input.key === 'Alt' ||
        (input.control && input.shift && input.key.toLowerCase() === 'i')

      if (forbidden) {
        event.preventDefault()
      }
    })
  }

  ipcMain.on('window-minimize', () => {
    mainWindow.minimize()
  })

  ipcMain.on('window-maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })

  ipcMain.on('window-close', () => {
    mainWindow.close()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => { app.quit() })

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) { createWindow() }
})
