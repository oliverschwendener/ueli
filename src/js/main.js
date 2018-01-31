import { app, BrowserWindow, globalShortcut, ipcMain, Tray, Menu, ipcRenderer } from 'electron'
import { autoUpdater } from 'electron-updater'
import ConfigManager from './ConfigManager'
import path from 'path'
import isDev from 'electron-is-dev'

let packageJson = require('./../package.json')
let appName = packageJson.productName
let mainWindow = null
let tray = null

let mainWindowHtml = `file://${__dirname}/../main.html`

let otherInstanceIsAlreadyRunning = app.makeSingleInstance((commandLine, workingDirectory) => { })

if (otherInstanceIsAlreadyRunning) {
  quitApp()
} else {
  startApp()
}

function startApp() {
  app.on('ready', () => {
    mainWindow = new BrowserWindow({
      frame: false,
      resizable: true,
      skipTaskbar: true,
      show: false
    })

    tray = new Tray(`${__dirname}/../img/icon.ico`)

    let trayMenu = Menu.buildFromTemplate([
      {
        label: 'About',
        click: getInfo
      },
      {
        label: 'Configuration',
        click: showConfig
      },
      {
        label: 'Show/Hide',
        click: toggleWindow
      },
      {
        label: 'Exit',
        click: app.quit
      }
    ])

    tray.setToolTip(appName)
    tray.setContextMenu(trayMenu)

    mainWindow.loadURL(mainWindowHtml)
    //mainWindow.webContents.openDevTools()

    mainWindow.on('closed', () => {
      globalShortcut.unregisterAll()
      mainWindow = null
    })

    mainWindow.on('blur', (event, arg) => {
      if (mainWindow.isVisible())
        hideWindow()
    })

    ipcMain.on('hide-main-window', (event, arg) => {
      hideWindow()
    })

    ipcMain.on('close-main-window', () => {
      app.quit()
    })

    ipcMain.on('reload-window', () => {
      setWindowOptions()
      setGlobalShortcuts()
      mainWindow.reload()
    })

    ipcMain.on('get-info', () => {
      getInfo()
    })

    ipcMain.on('check-for-update', () => {
      autoUpdater.checkForUpdates()
    })

    ipcMain.on('install-update', () => {
      autoUpdater.downloadUpdate()
    })

    setGlobalShortcuts()
    setWindowOptions()
    setZoomFactor()

    autoUpdater.autoDownload = false

    if (!isDev) {
      setUpAutoUpdater()
      setAutostartSettings()
    }
  })
}

function setUpAutoUpdater() {
  autoUpdater.checkForUpdates()

  autoUpdater.on('update-available', (info) => {
    mainWindow.webContents.send('update-available')
  })

  autoUpdater.on('update-not-available', (info) => {
    console.log('Up to date')
    mainWindow.webContents.send('up-to-date')
  })

  autoUpdater.on('error', (err) => {
    console.log('Error while checking for updates')
  })

  autoUpdater.on('download-progress', (progressObj) => {
    console.log('Downloading')
  })

  autoUpdater.on('update-downloaded', (info) => {
    console.log('donwload finished')
    autoUpdater.quitAndInstall();
  })
}

function setAutostartSettings() {
  let config = new ConfigManager().getConfig()
  app.setLoginItemSettings({
    openAtLogin: config.autoStart,
    path: process.execPath,
    args: []
  })
}

function quitApp() {
  app.quit()
}

function setWindowOptions() {
  let config = new ConfigManager().getConfig()
  mainWindow.setSize(parseFloat(config.size.width), parseFloat(config.size.height))
  mainWindow.setKiosk(config.fullscreen)
  mainWindow.center()

  setZoomFactor()
}

function setGlobalShortcuts() {
  let config = new ConfigManager().getConfig()
  globalShortcut.unregisterAll()
  globalShortcut.register(config.keyboardShortcut, toggleWindow)
}

function hideWindow() {
  mainWindow.hide()
}

function toggleWindow() {
  if (mainWindow.isVisible())
    hideWindow()
  else
    mainWindow.show()
}

function setZoomFactor() {
  let config = new ConfigManager().getConfig()
  let zoomFactor = parseFloat(config.zoomFactor)
  mainWindow.webContents.setZoomFactor(zoomFactor)
}

function getInfo() {
  mainWindow.show()
  mainWindow.webContents.send('get-info')
}

function showConfig() {
  mainWindow.show()
  mainWindow.webContents.send('show-config')
}