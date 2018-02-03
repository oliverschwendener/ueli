import * as path from "path";
import { app, BrowserWindow, ipcMain, } from "electron";
import { SearchEngine } from "./search-engine";
import { InputValidationService } from "./input-validation-service";

let mainWindow;
let inputValidationService = new InputValidationService();

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
};

app.on("ready", createMainWindow);

app.on("window-all-closed", () => {
    app.quit();
});

ipcMain.on('get-search', (event, arg) => {
    let userInput = arg;
    let result = inputValidationService.getSearchResult(userInput);
    event.sender.send('get-search-response', result);
});