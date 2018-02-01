"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
let mainWindow;
function createMainWindow() {
    mainWindow = new electron_1.BrowserWindow({
        center: true,
        autoHideMenuBar: true,
        vibrancy: "dark"
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
//# sourceMappingURL=main.js.map