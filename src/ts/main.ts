import * as path from "path";
import { app, BrowserWindow, ipcMain, globalShortcut } from "electron";
import { SearchEngine } from "./search-engine";
import { InputValidationService } from "./input-validation-service";
import { Injector } from "./injector";

let mainWindow;
let inputValidationService = new InputValidationService();
let executionService = Injector.getExecutionService();

const userInputHeigth = 80;
const searchResultHeight = 60;
const maxSearchResultCount = 8;
const windowWidth = 860;
const maxWindowHeight = userInputHeigth + (maxSearchResultCount * searchResultHeight);

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: windowWidth,
        height: maxWindowHeight,
        center: true,
        autoHideMenuBar: true,
        frame: false,
        show: false,
        skipTaskbar: true,
        resizable: false,
        backgroundColor: '#00000000'
    });

    mainWindow.loadURL(`file://${__dirname}/../main.html`);
    mainWindow.setSize(windowWidth, userInputHeigth);

    mainWindow.on("close", () => {
        globalShortcut.unregisterAll();
        mainWindow = null;
    });

    mainWindow.on("blur", () => {
        mainWindow.hide();
    });

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
    let newWindowHeight = searchResultCount >= maxSearchResultCount ? maxWindowHeight : (userInputHeigth + (searchResultCount * searchResultHeight));
    mainWindow.setSize(windowWidth, newWindowHeight);
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
    updateWindowSize(result.length);
    event.sender.send("get-search-response", result);
});

ipcMain.on("execute", (event, arg) => {
    let executionArgument = arg;
    executionService.execute(executionArgument);
    mainWindow.hide();
});

ipcMain.on("get-search-icon", (event, arg) => {
    let iconManager = Injector.getIconManager();
    event.sender.send("get-search-icon-response", iconManager.getSearchIcon());
});