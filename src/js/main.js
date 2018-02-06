"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const input_validation_service_1 = require("./input-validation-service");
const config_1 = require("./config");
let mainWindow;
let inputValidationService = new input_validation_service_1.InputValidationService();
let executionService = config_1.Config.getExecutionService();
function createMainWindow() {
    mainWindow = new electron_1.BrowserWindow({
        center: true,
        autoHideMenuBar: true,
        frame: false
    });
    mainWindow.loadURL(`file://${__dirname}/../main.html`);
    mainWindow.on("close", () => {
        mainWindow = null;
    });
    registerGlobalShortCuts();
}
;
function registerGlobalShortCuts() {
    electron_1.globalShortcut.register("alt+space", toggleWindow);
}
function toggleWindow() {
    if (mainWindow.isVisible()) {
        mainWindow.hide();
    }
    else {
        mainWindow.show();
    }
}
electron_1.app.on("ready", createMainWindow);
electron_1.app.on("window-all-closed", () => {
    electron_1.app.quit();
});
electron_1.ipcMain.on("hide-window", (event, arg) => {
    mainWindow.hide();
});
electron_1.ipcMain.on("get-search", (event, arg) => {
    let userInput = arg;
    let result = inputValidationService.getSearchResult(userInput);
    event.sender.send("get-search-response", result);
});
electron_1.ipcMain.on("execute", (event, arg) => {
    let executionArgument = arg;
    executionService.execute(executionArgument);
    mainWindow.hide();
});
//# sourceMappingURL=main.js.map