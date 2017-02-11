import electron from 'electron'

let app = electron.app
let BrowserWindow = electron.BrowserWindow
let globalShortcut = electron.globalShortcut
let ipcMain = electron.ipcMain

let mainWindow = null

let mainWindowOptions = {
  width: 960,
  height: 600,
  frame: false,
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
    mainWindow = null
  })

  mainWindow.on('blur', (event, arg) => {
    if (mainWindow.isVisible())
      mainWindow.hide()
  })

  ipcMain.on('hide-main-window', (event, arg) => {
    mainWindow.hide()
  })

  ipcMain.on('close-main-window', () => {
    app.quit()
  })

  ipcMain.on('reload-window', () => {
    mainWindow.reload()
  })

  globalShortcut.register('alt+space', () => {
    if (mainWindow.isVisible())
      mainWindow.hide()
    else
      mainWindow.show()
  })
})