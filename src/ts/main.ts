import * as path from "path";
import * as fs from "fs";
import { app, BrowserWindow, ipcMain, globalShortcut, Menu, Tray } from "electron";
import { SearchEngine } from "./search-engine";
import { InputValidationService } from "./input-validation-service";
import { Injector } from "./injector";
import { Config } from "./config";
import { ExecutionService } from "./execution-service";
import { FilePathExecutor } from "./executors/file-path-executor";

let mainWindow;
let trayIcon;
let iconPath = path.join(__dirname, `../../img/icons/${Injector.getIconPath()}`);
let filePathExecutor = new FilePathExecutor();
let inputValidationService = new InputValidationService();
let executionService = new ExecutionService();
let config = new Config();

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: config.windowWith,
        height: config.maxWindowHeight,
        center: true,
        autoHideMenuBar: true,
        frame: false,
        show: false,
        skipTaskbar: true,
        resizable: false,
        backgroundColor: '#00000000',
        icon: iconPath
    });

    mainWindow.loadURL(`file://${__dirname}/../main.html`);
    mainWindow.setSize(config.windowWith, config.minWindowHeight);

    mainWindow.on("close", quitApp);
    mainWindow.on("blur", hideMainWindow);

    createTrayIcon();
    registerGlobalShortCuts();
};

function createTrayIcon() {
    trayIcon = new Tray(iconPath);
    trayIcon.setToolTip("electronizr");
    trayIcon.setContextMenu(Menu.buildFromTemplate([
        {
            label: 'Show/Hide',
            click: toggleWindow
        },
        {
            label: 'Exit',
            click: quitApp
        }
    ]));
}

function registerGlobalShortCuts(): void {
    globalShortcut.register("alt+space", toggleWindow);
}

function toggleWindow(): void {
    if (mainWindow.isVisible()) {
        mainWindow.hide();
    }
    else {
        mainWindow.show();
    }
}

function updateWindowSize(searchResultCount: number): void {
    let newWindowHeight = config.calculateWindowHeight(searchResultCount);
    mainWindow.setSize(config.windowWith, newWindowHeight);
}

function hideMainWindow() {
    if (mainWindow !== null && mainWindow !== undefined) {
        mainWindow.hide();
    }
}

function reloadApp() {
    mainWindow.reload();
}

function quitApp() {
    globalShortcut.unregisterAll();
    app.quit();
}

app.on("ready", createMainWindow);
app.on("window-all-closed", quitApp);
ipcMain.on("hide-window", hideMainWindow);
ipcMain.on("ezr:reload", reloadApp);
ipcMain.on("ezr:exit", quitApp);

ipcMain.on("get-search", (event, arg) => {
    let userInput = arg;
    let result = inputValidationService.getSearchResult(userInput);
    updateWindowSize(result.length);
    event.sender.send("get-search-response", result);
});

ipcMain.on("execute", (event, arg) => {
    let executionArgument = arg;
    executionService.execute(executionArgument);
});

ipcMain.on("open-file-location", (event, arg) => {
    let filePath = arg;
    if (filePathExecutor.isValidForExecution(filePath)) {
        filePathExecutor.openFileLocation(filePath);
    }
});

ipcMain.on("auto-complete", (event, arg) => {
    let userInput = arg[0];
    let executionArgument = arg[1];
    let dirSeparator = Injector.getDirectorySeparator();

    if (filePathExecutor.isValidForExecution(userInput)) {
        if (!executionArgument.endsWith(dirSeparator) && fs.lstatSync(executionArgument).isDirectory()) {
            executionArgument = `${executionArgument}${dirSeparator}`;
        }

        event.sender.send("auto-complete-response", executionArgument);
    }
});

ipcMain.on("get-search-icon", (event, arg) => {
    let iconManager = Injector.getIconManager();
    event.sender.send("get-search-icon-response", iconManager.getSearchIcon());
});

ipcMain.on("command-line-execution", (arg) => {
    mainWindow.webContents.send("command-line-output", arg);
    updateWindowSize(config.maxSearchResultCount);
});