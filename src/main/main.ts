import { app, BrowserWindow, ipcMain, globalShortcut } from "electron";
import { join } from "path";
import { IpcChannels } from "../common/ipc-channels";
import { defaultUserConfigOptions } from "../common/config/default-user-config-options";
import { SearchResultItem } from "../common/search-result-item";
import { getProductionSearchEngine } from "./production/production-search-engine";
import { UserConfigOptions } from "../common/config/user-config-options";
import { ConsoleLogger } from "../common/logger/console-logger";

const logger = new ConsoleLogger();
let mainWindow: BrowserWindow;
let settingsWindow: BrowserWindow | null;
let config = defaultUserConfigOptions;
let searchEngine = getProductionSearchEngine(config);
const rescanInterval = setInterval(() => {
    searchEngine.refreshIndexes()
        .then(() => logger.debug("Successfully refreshed indexes"))
        .catch((err) => logger.error(`Error while refresh indexes: ${err}`));
}, config.generalOptions.refreshIntervalInSeconds * 1000);

const getMaxWindowHeight = (): number => {
    return config.generalOptions.maxSearchResultsPerPage * config.generalOptions.searchResultHeight + config.generalOptions.userInputHeight;
};

const updateMainWindowSize = (searchResultCount: number) => {
    mainWindow.setResizable(true);
    const windowHeight = searchResultCount > config.generalOptions.maxSearchResultsPerPage
        ? getMaxWindowHeight()
        : searchResultCount * config.generalOptions.searchResultHeight + config.generalOptions.userInputHeight;
    mainWindow.setSize(Number(config.generalOptions.windowWidth), Number(windowHeight));
    mainWindow.setResizable(false);
};

const registerGlobalKeyboardShortcut = (toggleAction: () => void) => {
    globalShortcut.unregisterAll();
    globalShortcut.register(config.generalOptions.hotKey, toggleAction);
};

const showMainWindow = () => {
    mainWindow.show();
    mainWindow.webContents.send(IpcChannels.mainWindowHasBeenShown);
};

const hideMainWindow = () => {
    setTimeout(() => {
        mainWindow.hide();
    }, 25);
};

const toggleMainWindow = () => {
    if (mainWindow.isVisible()) {
        hideMainWindow();
    } else {
        showMainWindow();
    }
};

const reloadApp = () => {
    updateMainWindowSize(0);
    config = defaultUserConfigOptions;
    searchEngine = getProductionSearchEngine(config);
    mainWindow.reload();
};

const quitApp = () => {
    clearInterval(rescanInterval);
    globalShortcut.unregisterAll();
    app.quit();
};

const startApp = () => {
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
    mainWindow.on("blur", hideMainWindow);
    mainWindow.on("closed", quitApp);
    mainWindow.loadFile(join(__dirname, "..", "main.html"));

    updateMainWindowSize(0);
    registerGlobalKeyboardShortcut(toggleMainWindow);
};

app.on("ready", () => {
    const gotSingleInstanceLock = app.requestSingleInstanceLock();
    if (gotSingleInstanceLock) {
        startApp();
    } else {
        logger.error("Other instance is already running: quitting app.");
        quitApp();
    }
});

app.on("window-all-closed", quitApp);
app.on("quit", app.quit);

ipcMain.on(IpcChannels.configUpdated, (event: Electron.Event, updatedConfig: UserConfigOptions) => {
    config = updatedConfig;
    searchEngine.updateConfig(updatedConfig)
        .then(() => {
            searchEngine.refreshIndexes()
                .then(() =>  logger.debug("Successfully refreshed all indexes"))
                .catch((err) => logger.error(err));
        })
        .catch((err) =>  logger.error(err));
});

ipcMain.on(IpcChannels.search, (event: Electron.Event, userInput: string) => {
    searchEngine.getSearchResults(userInput)
        .then((result) => {
            updateMainWindowSize(result.length);
            event.sender.send(IpcChannels.searchResponse, result);
        })
        .catch((err) => logger.error(err));
});

ipcMain.on(IpcChannels.execute, (event: Electron.Event, searchResultItem: SearchResultItem) => {
    searchEngine.execute(searchResultItem)
        .then(() => {
            mainWindow.webContents.send(IpcChannels.executionSucceeded);
            hideMainWindow();
        })
        .catch((err) => logger.error(err));
});

ipcMain.on(IpcChannels.reloadApp, () => {
    reloadApp();
});

ipcMain.on(IpcChannels.openSettingsWindow, () => {
    if (!settingsWindow || settingsWindow.isDestroyed()) {
        settingsWindow = new BrowserWindow();
        settingsWindow.setMenu(null);
        settingsWindow.loadFile(join(__dirname, "..", "settings.html"));
    } else {
        settingsWindow.focus();
    }
});
