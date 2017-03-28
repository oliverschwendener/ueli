import electron from 'electron'
import ConfigManager from './ConfigManager'

let app = electron.app
let BrowserWindow = electron.BrowserWindow
let globalShortcut = electron.globalShortcut
let ipcMain = electron.ipcMain
let configManager = new ConfigManager()

let mainWindow = null

let mainWindowOptions = {
  width: configManager.getConfig().size.width,
  height: configManager.getConfig().size.height,
  frame: false,
  kiosk: configManager.getConfig().fullscreen,
  resizable: true,
  skipTaskbar: true,
  show: false,
  icon: 'build/icon.ico'
}

let mainWindowHtml = `file://${__dirname}/../main.html`

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit()
  }
})

app.on('ready', () => {
  mainWindow = new BrowserWindow(mainWindowOptions)

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

  setGlobalShortcuts()
})

function setWindowOptions() {
  let config = new ConfigManager().getConfig()

  mainWindow.setSize(config.size.width, config.size.height)
  mainWindow.setKiosk(config.fullscreen)
  mainWindow.center()
}

function setGlobalShortcuts() {
  let config = new ConfigManager().getConfig()

  globalShortcut.unregisterAll()
  globalShortcut.register(config.keyboardShortcut, () => {
    if (mainWindow.isVisible())
      hideWindow()
    else
      mainWindow.show()
  })
}

function hideWindow() {
  setTimeout(() => {
    mainWindow.hide()
  }, 5)
}