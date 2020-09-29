import { BrowserWindow, app } from "electron";
import { join } from "path";
import { watch } from "fs";
import { spawn } from "child_process";
export function enableHotRealod() {
    const browserWindows: BrowserWindow[] = [];
    app.on('browser-window-created', (event, window) => {
        browserWindows.push(window);
        window.on('closed', () => {
            const index = browserWindows.indexOf(window);
            browserWindows.splice(index, 1);
        });
    });

    const rendererFilesList = [
        join(__dirname, "../bundle/renderer.js"),
        join(__dirname, "../main.html"),
        join(__dirname, "../settings.html"),
        join(__dirname, "../styles/app.css"),
        join(__dirname, "../styles/settings.css")
    ];
    rendererFilesList.forEach(file => {
        watch(file, () => {
            browserWindows.forEach(window => {
                window.reload();
            });
        });
    });

    const mainFilesList = [join(__dirname, "../bundle/main.js")];
    mainFilesList.forEach(file => {
        watch(file, () => {
            app.exit();
            spawn("yarn", ["start"], { shell: true, stdio: "inherit" });
        });
    });
}