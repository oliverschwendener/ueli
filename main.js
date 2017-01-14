var electron = require('electron');

var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var globalShortcut = electron.globalShortcut;
var ipcMain = electron.ipcMain;

var mainWindow = null;

var mainWindowOptions = {
  width: 900,
  height: 586,
  frame: false,
  resizable: false,
  devTools: true,
  skipTaskbar: true,
  show: false,
  center: true,
  icon: 'build/icon.ico'
};

var mainWindowHtml = 'file://' + __dirname + '/main.html';

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
    mainWindow.hide();
    event.returnValue = true;
  });

  ipcMain.on('hide-main-window', function (event, arg) {
    mainWindow.hide();
    event.returnValue = true;
  });

  ipcMain.on('close-main-window', function () {
    app.quit();
  });

  ipcMain.on('reload-window', function (event, arg) {
    mainWindow.reload();
    event.returnValue = true;
  });

  globalShortcut.register('alt+space', function () {
    if (mainWindow.isVisible())
      mainWindow.hide();
    else
      mainWindow.show();
  });

});
