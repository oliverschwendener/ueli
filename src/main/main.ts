import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { IpcChannels } from "../common/ipc-channels";
import { SearchEngine } from "./search-engine";
import { ProgramsPlugin } from "./programs-plugin";

let window: BrowserWindow;

const searchEngine = new SearchEngine([
    new ProgramsPlugin(),
]);

app.on("ready", () => {
    window = new BrowserWindow();
    window.loadFile(join(__dirname, "..", "main.html"));
});

app.on("window-all-closed", () => {
    app.quit();
});

ipcMain.on(IpcChannels.search, (event: Electron.Event, userInput: string) => {
    const result = searchEngine.getSearchResults(userInput);
    event.sender.send(IpcChannels.searchResponse, result);
});
