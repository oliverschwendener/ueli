import { app, BrowserWindow, globalShortcut, ipcMain, Tray, Menu } from 'electron'
import { autoUpdater } from 'electron-updater'
import ConfigManager from './ConfigManager'
import path from 'path'

let config = new ConfigManager().getConfig()
let mainWindow = null
let tray = null

let mainWindowHtml = `file://${__dirname}/../main.html`

let shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => { })

// quit if other instance is already running
if (shouldQuit) {
  app.quit()
} else {
  app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
      app.quit()
    }
  })

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
        label: 'Show/Hide',
        click: toggleWindow
      },
      {
        label: 'Exit',
        click: app.quit
      }
    ])

    tray.setToolTip('electronizr')
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

    ipcMain.on('download-update', () => {
      autoUpdater.downloadUpdate()
    })

    setGlobalShortcuts()
    setWindowOptions()
    setZoomFactor()

    autoUpdater.autoDownload = false
    autoUpdater.checkForUpdates()

    let execPath = process.execPath
    if (!execPath.endsWith('electron.exe')) {
      app.setLoginItemSettings({
        openAtLogin: config.autoStart,
        path: execPath,
        args: []
      })
    }
  })
}

autoUpdater.on('update-available', (info) => {
  console.log('Update available')
  mainWindow.webContents.send('update-update-status', 'Download Update')
})

autoUpdater.on('update-not-available', (info) => {
  console.log('Up to date')
  mainWindow.webContents.send('update-update-status', 'Up to date')
})

autoUpdater.on('error', (err) => {
  console.log('Error')
  mainWindow.webContents.send('update-update-status', 'Error')
})

autoUpdater.on('download-progress', (progressObj) => {
  console.log('Downloading')
  mainWindow.webContents.send('update-update-status', 'Downloading')
})

autoUpdater.on('update-downloaded', (info) => {
  console.log('donwload finished')
  autoUpdater.quitAndInstall();
})

function setWindowOptions() {
  mainWindow.setSize(parseFloat(config.size.width), parseFloat(config.size.height))
  mainWindow.setKiosk(config.fullscreen)
  mainWindow.center()

  setZoomFactor()
}

function setGlobalShortcuts() {
  globalShortcut.unregisterAll()
  globalShortcut.register(config.keyboardShortcut, () => {
    toggleWindow()
  })
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
  let zoomFactor = parseFloat(config.zoomFactor)
  mainWindow.webContents.setZoomFactor(zoomFactor)
}

function getInfo() {
  mainWindow.show()
  mainWindow.webContents.send('get-info')
}