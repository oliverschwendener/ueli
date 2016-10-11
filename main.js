var electron = require('electron');  // Module to control application life.

var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var globalShortcut = electron.globalShortcut;
var ipcMain = electron.ipcMain;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function(){
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin'){
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function(){
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 600,
    height: 150,
    frame:false,
    //resizable: true,
    //devTools: true,
    transparent: true
  });

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function(){
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.on('blur', function(){
    mainWindow.hide();
  });

  globalShortcut.register('alt+space', function(){
    if(mainWindow.isVisible())
      mainWindow.hide();
    else
      mainWindow.show();
  });

  ipcMain.on('hide-main-window', function(){
    mainWindow.hide();
  });

  ipcMain.on('close-main-window', function(){
    app.quit();
  })
});