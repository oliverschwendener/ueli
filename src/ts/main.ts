import * as path from "path";
import { app, BrowserWindow, } from "electron";

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        center: true,
        autoHideMenuBar: true,
        vibrancy: "dark"
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