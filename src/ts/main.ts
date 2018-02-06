import * as path from "path";
import { app, BrowserWindow, ipcMain, globalShortcut } from "electron";
import { SearchEngine } from "./search-engine";
import { InputValidationService } from "./input-validation-service";
import { Config } from "./config";

let mainWindow;
let inputValidationService = new InputValidationService();
let executionService = Config.getExecutionService();

function createMainWindow() {
    mainWindow = new BrowserWindow({
        center: true,
        autoHideMenuBar: true,
        frame: false
    });

    mainWindow.loadURL(`file://${__dirname}/../main.html`);

    mainWindow.on("close", () => {
        mainWindow = null;
    });

    registerGlobalShortCuts();
};

function registerGlobalShortCuts() {
    globalShortcut.register("alt+space", toggleWindow);
}

function toggleWindow() {
    if (mainWindow.isVisible()) {
        mainWindow.hide();
    }
    else {
        mainWindow.show();
    }
}

app.on("ready", createMainWindow);

app.on("window-all-closed", () => {
    app.quit();
});

ipcMain.on("hide-window", (event, arg) => {
    mainWindow.hide();
});

ipcMain.on("get-search", (event, arg) => {
    let userInput = arg;
    let result = inputValidationService.getSearchResult(userInput);
    event.sender.send("get-search-response", result);
});

ipcMain.on("execute", (event, arg) => {
    let executionArgument = arg;
    executionService.execute(executionArgument);
    mainWindow.hide();
});