var electron = require('electron');

var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var globalShortcut = electron.globalShortcut;
var ipcMain = electron.ipcMain;

var mainWindow = null;

var mainWindowOptions = {
  width: 800,
  minWidth: 800,
  //minHeight: 78,
  //maxHeight: 568,
  //frame: false,
  resizable: false,
  devTools: true,
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

  //Set to start size
  mainWindow.setSize(800, 600);
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.on('blur', function () {
    //mainWindow.hide();
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
  });

  ipcMain.on('reload-window', function() {
    mainWindow.hide();
    mainWindow.reload();
  });

  ipcMain.on('resize-window', (event, height) => {
    /*
    mainWindow.setSize(800, height, true);
    event.returnValue = 0;
    */
  });

});
