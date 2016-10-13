var electron = require('electron');

var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var globalShortcut = electron.globalShortcut;
var ipcMain = electron.ipcMain;

var mainWindow = null;

var mainWindowOptions = {
  width: 600,
  height: 150,
  frame: false,
  //resizable: true,
  //devTools: true,
  transparent: true,
  skipTaskbar: true,
  show: false,
  center: true
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

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.on('blur', function () {
    mainWindow.hide();
  });

  globalShortcut.register('alt+space', function () {
    if (mainWindow.isVisible())
      mainWindow.hide();
    else
      mainWindow.show();
  });

  ipcMain.on('hide-main-window', function () {
    mainWindow.hide();
  });

  ipcMain.on('close-main-window', function () {
    app.quit();
  })
});