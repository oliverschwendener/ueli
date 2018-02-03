"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const input_validation_service_1 = require("./input-validation-service");
let mainWindow;
let inputValidationService = new input_validation_service_1.InputValidationService();
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
}
;
electron_1.app.on("ready", createMainWindow);
electron_1.app.on("window-all-closed", () => {
    electron_1.app.quit();
});
electron_1.ipcMain.on('get-search', (event, arg) => {
    let userInput = arg;
    let result = inputValidationService.getSearchResult(userInput);
    event.sender.send('get-search-response', result);
});
//# sourceMappingURL=main.js.map