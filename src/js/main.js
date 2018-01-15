import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Tray,
  Menu
} from 'electron'
import ConfigManager from './ConfigManager'

let configManager = new ConfigManager()
let mainWindow = null
let tray = null

let mainWindowHtml = `file://${__dirname}/../main.html`

let shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {})

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
    let trayMenu = Menu.buildFromTemplate([{
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
      mainWindow.webContents.send('get-info')
    })

    setGlobalShortcuts()
    setWindowOptions()
    setZoomFactor()
  })
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
  let zoomFactor = parseFloat(new ConfigManager().getConfig().zoomFactor)
  mainWindow.webContents.setZoomFactor(zoomFactor)
}

function getInfo() {
  mainWindow.webContents.send('get-info')
}