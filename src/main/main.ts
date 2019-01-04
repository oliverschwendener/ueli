import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { IpcChannels } from "../common/ipc-channels";
import { SearchEngine } from "./search-engine";
import { ApplicationSearchPlugin } from "./search-plugins/application-search-plugin/application-search-plugin";
import { FileApplicationRepository } from "./search-plugins/application-search-plugin/file-application-repository";
import { defaultUserConfigOptions } from "../common/config/default-user-config-options";
import { SearchResultItem } from "../common/search-result-item";
import { ApplicationIconService } from "./search-plugins/application-search-plugin/application-icon-service";
import { getWindowsAppIcons } from "./search-plugins/application-search-plugin/application-icon-helpers";

let window: BrowserWindow;
const config = defaultUserConfigOptions;
const searchEngine = new SearchEngine([
    new ApplicationSearchPlugin(new FileApplicationRepository(new ApplicationIconService(getWindowsAppIcons), config.applicationSearchOptions)),
], config.generalOptions);

const rescanInterval = setInterval(() => {
    searchEngine.refreshIndexes()
        .then(() => {
            // tslint:disable-next-line:no-console
            console.log("Successfully refreshed indexes");
        })
        .catch((err) => {
            // tslint:disable-next-line:no-console
            console.log(`Error while refresh indexes: ${err}`);
        });
}, config.generalOptions.refreshIntervalInSeconds * 1000);

const getMaxWindowHeight = (): number => {
    return config.generalOptions.maxSearchResults * config.generalOptions.searchResultHeight + config.generalOptions.userInputHeight;
};

const updateWindowSize = (searchResultCount: number) => {
    window.setResizable(true);
    const windowHeight = searchResultCount > config.generalOptions.maxSearchResults
        ? getMaxWindowHeight()
        : searchResultCount * config.generalOptions.searchResultHeight + config.generalOptions.userInputHeight;

    window.setSize(config.generalOptions.windowWidth, windowHeight);
    window.setResizable(false);
};

const quitApp = () => {
    clearInterval(rescanInterval);
};

app.on("ready", () => {
    window = new BrowserWindow({
        center: true,
        frame: false,
        height: getMaxWindowHeight(),
        resizable: false,
        transparent: true,
        width: config.generalOptions.windowWidth,
    });
    window.loadFile(join(__dirname, "..", "main.html"));
    updateWindowSize(0);
});

app.on("window-all-closed", quitApp);
app.on("quit", quitApp);

ipcMain.on(IpcChannels.search, (event: Electron.Event, userInput: string) => {
    searchEngine.getSearchResults(userInput)
        .then((result) => {
            updateWindowSize(result.length);
            event.sender.send(IpcChannels.searchResponse, result);
        })
        .catch((err) => {
            // tslint:disable-next-line:no-console
            console.log(err);
        });
});

ipcMain.on(IpcChannels.execute, (event: Electron.Event, searchResultItem: SearchResultItem) => {
    // tslint:disable-next-line:no-console
    console.log(`Executing: ${searchResultItem.name}`);
});
