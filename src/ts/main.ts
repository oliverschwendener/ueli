import * as path from "path";
import { app, BrowserWindow, ipcMain, globalShortcut } from "electron";
import { SearchEngine } from "./search-engine";
import { InputValidationService } from "./input-validation-service";
import { Injector } from "./injector";
import { Config } from "./config";
import { ExecutionService } from "./execution-service";

let mainWindow;
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
        backgroundColor: '#00000000'
    });

    mainWindow.loadURL(`file://${__dirname}/../main.html`);
    mainWindow.setSize(config.windowWith, config.minWindowHeight);

    mainWindow.on("close", quitApp);

    mainWindow.on("blur", hideMainWindow);

    registerGlobalShortCuts();
};

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
    mainWindow = null;
    globalShortcut.unregisterAll();
    app.quit();
}

app.on("ready", createMainWindow);

app.on("window-all-closed", () => {
    app.quit();
});

ipcMain.on("hide-window", hideMainWindow);

ipcMain.on("get-search", (event, arg) => {
    let userInput = arg;
    let result = inputValidationService.getSearchResult(userInput);
    updateWindowSize(result.length);
    event.sender.send("get-search-response", result);
});

ipcMain.on("execute", (event, arg) => {
    let executionArgument = arg;
    executionService.execute(executionArgument);
    hideMainWindow();
});

ipcMain.on("get-search-icon", (event, arg) => {
    let iconManager = Injector.getIconManager();
    event.sender.send("get-search-icon-response", iconManager.getSearchIcon());
});

ipcMain.on("ezr:reload", reloadApp);

ipcMain.on("ezr:exit", quitApp);