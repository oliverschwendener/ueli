import * as path from "path";
import * as fs from "fs";
import { app, BrowserWindow, ipcMain, globalShortcut, Menu, Tray, MenuItem } from "electron";
import { autoUpdater } from "electron-updater";
import { SearchEngine } from "./search-engine";
import { InputValidationService } from "./input-validation-service";
import { Injector } from "./injector";
import { Config } from "./config";
import { ExecutionService } from "./execution-service";
import { FilePathExecutor } from "./executors/file-path-executor";
import { FilePathExecutionArgumentValidator } from "./execution-argument-validators/file-path-execution-argument-validator";
const isDev = require("electron-is-dev");

let mainWindow: BrowserWindow;
let trayIcon: Tray;
let filePathExecutor = new FilePathExecutor();
let inputValidationService = new InputValidationService();
let executionService = new ExecutionService();

function createMainWindow(): void {
    mainWindow = new BrowserWindow({
        width: Config.windowWith,
        height: Config.maxWindowHeight,
        center: true,
        autoHideMenuBar: true,
        frame: false,
        show: false,
        skipTaskbar: true,
        resizable: false,
        backgroundColor: '#00000000',
    });

    mainWindow.loadURL(`file://${__dirname}/../../main.html`);
    mainWindow.setSize(Config.windowWith, Config.minWindowHeight);

    mainWindow.on("close", quitApp);
    mainWindow.on("blur", hideMainWindow);

    createTrayIcon();
    registerGlobalShortCuts();

    if (!isDev) {
        checkForUpdates();
        setAutostartSettings();
    }
};

function createTrayIcon(): void {
    trayIcon = new Tray(Injector.getTrayIconPath(path.join(__dirname, "../../")));
    trayIcon.setToolTip("electronizr");
    trayIcon.setContextMenu(Menu.buildFromTemplate([
        {
            label: "Show/Hide",
            click: toggleWindow
        },
        {
            label: "Exit",
            click: quitApp
        }
    ]));
}

function registerGlobalShortCuts(): void {
    globalShortcut.register("alt+space", toggleWindow);
}

function checkForUpdates(): void {
    autoUpdater.autoDownload = false;
    autoUpdater.checkForUpdates();
}

function downloadUpdate(): void {
    autoUpdater.downloadUpdate();
    addUpdateStatusToTrayIcon("Downloading update...");
}

autoUpdater.on("update-available", (): void => {
    addUpdateStatusToTrayIcon("Download & install update", downloadUpdate);
});

autoUpdater.on("error", (): void => {
    addUpdateStatusToTrayIcon("Update check failed");
});

autoUpdater.on("update-not-available", (): void => {
    addUpdateStatusToTrayIcon("electronizr is up to date");
});

autoUpdater.on("update-downloaded", (): void => {
    autoUpdater.quitAndInstall();
});

function setAutostartSettings() {
    app.setLoginItemSettings({
        openAtLogin: Config.autoStartApp,
        path: process.execPath,
        args: []
    });
}

function addUpdateStatusToTrayIcon(label: string, clickHandler?: Function): void {
    let updateItem = clickHandler === undefined
        ? { label: label }
        : { label: label, click: clickHandler } as MenuItem;

    trayIcon.setContextMenu(Menu.buildFromTemplate([
        updateItem,
        {
            label: "Show/Hide",
            click: toggleWindow
        },
        {
            label: "Exit",
            click: quitApp
        }
    ]));
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
    let newWindowHeight = Config.calculateWindowHeight(searchResultCount);
    mainWindow.setSize(Config.windowWith, newWindowHeight);
}

function hideMainWindow(): void {
    if (mainWindow !== null && mainWindow !== undefined) {
        mainWindow.hide();
    }
}

function reloadApp(): void {
    mainWindow.reload();
}

function quitApp(): void {
    globalShortcut.unregisterAll();
    app.quit();
}

app.on("ready", createMainWindow);
app.on("window-all-closed", quitApp);
ipcMain.on("hide-window", hideMainWindow);
ipcMain.on("ezr:reload", reloadApp);
ipcMain.on("ezr:exit", quitApp);

ipcMain.on("get-search", (event: any, arg: string): void => {
    let userInput = arg;
    let result = inputValidationService.getSearchResult(userInput);
    updateWindowSize(result.length);
    event.sender.send("get-search-response", result);
});

ipcMain.on("execute", (event: any, arg: string): void => {
    let executionArgument = arg;
    executionService.execute(executionArgument);
});

ipcMain.on("open-file-location", (event: any, arg: string): void => {
    let filePath = arg;
    if (new FilePathExecutionArgumentValidator().isValidForExecution(filePath)) {
        filePathExecutor.openFileLocation(filePath);
    }
});

ipcMain.on("auto-complete", (event: any, arg: string[]): void => {
    let userInput = arg[0];
    let executionArgument = arg[1];
    let dirSeparator = Injector.getDirectorySeparator();

    if (new FilePathExecutionArgumentValidator().isValidForExecution(userInput)) {
        if (!executionArgument.endsWith(dirSeparator) && fs.lstatSync(executionArgument).isDirectory()) {
            executionArgument = `${executionArgument}${dirSeparator}`;
        }

        event.sender.send("auto-complete-response", executionArgument);
    }
});

ipcMain.on("get-search-icon", (event: any): void => {
    let iconManager = Injector.getIconManager();
    event.sender.send("get-search-icon-response", iconManager.getSearchIcon());
});

ipcMain.on("command-line-execution", (arg: string): void => {
    mainWindow.webContents.send("command-line-output", arg);
    updateWindowSize(Config.maxSearchResultCount);
});