import { app, BrowserWindow, ipcMain, globalShortcut } from "electron";
import { join } from "path";
import { IpcChannels } from "../common/ipc-channels";
import { defaultUserConfigOptions } from "../common/config/default-user-config-options";
import { SearchResultItem } from "../common/search-result-item";
import { getProductionSearchEngine } from "./production/production-search-engine";

let mainWindow: BrowserWindow;
let config = defaultUserConfigOptions;
let searchEngine = getProductionSearchEngine(config);
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
    return config.generalOptions.maxSearchResultsPerPage * config.generalOptions.searchResultHeight + config.generalOptions.userInputHeight;
};

const updateWindowSize = (window: BrowserWindow, searchResultCount: number) => {
    window.setResizable(true);
    const windowHeight = searchResultCount > config.generalOptions.maxSearchResultsPerPage
        ? getMaxWindowHeight()
        : searchResultCount * config.generalOptions.searchResultHeight + config.generalOptions.userInputHeight;
    window.setSize(config.generalOptions.windowWidth, windowHeight);
    window.setResizable(false);
};

const registerGlobalKeyboardShortcut = (toggleAction: () => void) => {
    globalShortcut.unregisterAll();
    globalShortcut.register(config.generalOptions.hotKey, toggleAction);
};

const showWindow = () => {
    mainWindow.show();
    mainWindow.webContents.send(IpcChannels.mainWindowHasBeenShown);
};

const hideWindow = () => {
    setTimeout(() => {
        mainWindow.hide();
    }, 25);
};

const toggleMainWindow = () => {
    if (mainWindow.isVisible()) {
        hideWindow();
    } else {
        showWindow();
    }
};

const reloadApp = () => {
    updateWindowSize(mainWindow, 0);
    config = defaultUserConfigOptions;
    searchEngine = getProductionSearchEngine(config);
    mainWindow.reload();
};

const quitApp = () => {
    clearInterval(rescanInterval);
    globalShortcut.unregisterAll();
    app.quit();
};

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        center: true,
        frame: false,
        height: getMaxWindowHeight(),
        resizable: false,
        show: false,
        skipTaskbar: true,
        transparent: true,
        width: config.generalOptions.windowWidth,
    });
    mainWindow.on("blur", hideWindow);
    mainWindow.loadFile(join(__dirname, "..", "main.html"));
    updateWindowSize(mainWindow, 0);
    registerGlobalKeyboardShortcut(toggleMainWindow);
});

app.on("window-all-closed", quitApp);
app.on("quit", quitApp);

ipcMain.on(IpcChannels.search, (event: Electron.Event, userInput: string) => {
    searchEngine.getSearchResults(userInput)
        .then((result) => {
            updateWindowSize(mainWindow, result.length);
            event.sender.send(IpcChannels.searchResponse, result);
        })
        .catch((err) => {
            // tslint:disable-next-line:no-console
            console.log(err);
        });
});

ipcMain.on(IpcChannels.execute, (event: Electron.Event, searchResultItem: SearchResultItem) => {
    searchEngine.execute(searchResultItem)
        .then(() => {
            mainWindow.webContents.send(IpcChannels.executionSucceeded);
            hideWindow();
        })
        // tslint:disable-next-line:no-console
        .catch((err) => console.log(err));
});

ipcMain.on(IpcChannels.reloadApp, () => {
    reloadApp();
});
