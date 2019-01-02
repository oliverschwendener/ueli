import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { IpcChannels } from "../common/ipc-channels";
import { SearchEngine } from "./search-engine";
import { ProgramSearchPlugin } from "./search-plugins/program-search-plugin/program-search-plugin";
import { WindowsProgramRepository } from "./search-plugins/program-search-plugin/windows-program-repository";

let window: BrowserWindow;

const searchEngine = new SearchEngine([
    new ProgramSearchPlugin(new WindowsProgramRepository()),
]);

app.on("ready", () => {
    window = new BrowserWindow();
    window.loadFile(join(__dirname, "..", "main.html"));
});

app.on("window-all-closed", () => {
    app.quit();
});

ipcMain.on(IpcChannels.search, (event: Electron.Event, userInput: string) => {
    searchEngine.getSearchResults(userInput)
        .then((result) => {
            event.sender.send(IpcChannels.searchResponse, result);
        })
        .catch((err) => {
            // tslint:disable-next-line:no-console
            console.log(err);
        });
});
