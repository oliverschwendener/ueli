import electron from 'electron';
import HotKeyManager from './Managers/HotKeyManager';

let app = electron.app;
let BrowserWindow = electron.BrowserWindow;
let globalShortcut = electron.globalShortcut;
let ipcMain = electron.ipcMain;
let hotKey = new HotKeyManager().getHotKey();

let mainWindow = null;

let mainWindowOptions = {
  width: 960,
  height: 600,
  frame: false,
  resizable: false,
  devTools: true,
  skipTaskbar: true,
  show: false,
  center: true,
  icon: 'build/icon.ico'
};

let mainWindowHtml = 'file://' + __dirname + '/../main.html';

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function () {
  mainWindow = new BrowserWindow(mainWindowOptions);

  mainWindow.loadURL(mainWindowHtml);
  //mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.on('blur', function (event, arg) {
    if (mainWindow.isVisible())
      mainWindow.hide();
  });

  ipcMain.on('hide-main-window', function (event, arg) {
    mainWindow.hide();
  });

  ipcMain.on('close-main-window', function () {
    app.quit();
  });

  ipcMain.on('reload-window', function (event, arg) {
    mainWindow.reload();
  });

  globalShortcut.register(hotKey, function () {
    if (mainWindow.isVisible())
      mainWindow.hide();
    else
      mainWindow.show();
  });

});
