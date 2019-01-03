import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { IpcChannels } from "../common/ipc-channels";
import { SearchEngine } from "./search-engine";
import { ApplicationSearchPlugin } from "./search-plugins/application-search-plugin/application-search-plugin";
import { FileApplicationRepository } from "./search-plugins/application-search-plugin/file-application-repository";
import { defaultUserConfigOptions } from "../common/config/default-user-config-options";

let window: BrowserWindow;

const config = defaultUserConfigOptions;

const searchEngine = new SearchEngine([
    new ApplicationSearchPlugin(new FileApplicationRepository(config.applicationSearchOptions)),
], config.generalOptions);

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
