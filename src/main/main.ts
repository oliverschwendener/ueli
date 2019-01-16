import { app, BrowserWindow, ipcMain, globalShortcut } from "electron";
import { join } from "path";
import { IpcChannels } from "../common/ipc-channels";
import { SearchResultItem } from "../common/search-result-item";
import { getProductionSearchEngine } from "./production/production-search-engine";
import { UserConfigOptions } from "../common/config/user-config-options";
import { ConsoleLogger } from "../common/logger/console-logger";
import { ElectronStoreConfigRepository } from "../common/config/electron-store-config-repository";
import { defaultUserConfigOptions } from "../common/config/default-user-config-options";
import { AppearanceOptions } from "../common/config/appearance-options";

const logger = new ConsoleLogger();
const configRepository = new ElectronStoreConfigRepository(defaultUserConfigOptions);

let mainWindow: BrowserWindow;
let settingsWindow: BrowserWindow;

let config = configRepository.getConfig();
let searchEngine = getProductionSearchEngine(config);

const notifyRenderer = (ipcChannel: IpcChannels, message?: string) => {
    const allWindows = [mainWindow, settingsWindow];
    allWindows.forEach((window) => window.webContents.send(ipcChannel, message));
};

const refreshAllIndexes = () => {
    searchEngine.refreshIndexes()
        .then(() => {
            const message = "Successfully refreshed indexes";
            logger.debug(message);
            notifyRenderer(IpcChannels.indexRefreshSucceeded, message);
        })
        .catch((err) => {
            logger.error(err);
            notifyRenderer(IpcChannels.indexRefreshFailed, err);
        });
};

let rescanInterval = setInterval(() => refreshAllIndexes(), Number(config.generalOptions.rescanIntervalInSeconds) * 1000);

const registerGlobalKeyboardShortcut = (toggleAction: () => void, hotKey: string) => {
    globalShortcut.unregisterAll();
    globalShortcut.register(hotKey, toggleAction);
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

const getMaxWindowHeight = (maxSearchResultsPerPage: number, searchResultHeight: number, userInputHeight: number): number => {
    return Number(maxSearchResultsPerPage) * Number(searchResultHeight) + Number(userInputHeight);
};

const updateConfig = (updatedConfig: UserConfigOptions) => {
    if (updatedConfig.generalOptions.hotKey !== config.generalOptions.hotKey) {
        registerGlobalKeyboardShortcut(toggleMainWindow, updatedConfig.generalOptions.hotKey);
    }

    if (updatedConfig.generalOptions.rescanIntervalInSeconds !== config.generalOptions.rescanIntervalInSeconds) {
        clearInterval(rescanInterval);
        rescanInterval = setInterval(() => refreshAllIndexes(), updatedConfig.generalOptions.rescanIntervalInSeconds * 1000);
    }

    if (updatedConfig.appearanceOptions.windowWidth !== config.appearanceOptions.windowWidth) {
        mainWindow.setResizable(true);
        mainWindow.setSize(Number(updatedConfig.appearanceOptions.windowWidth), getMaxWindowHeight(
            updatedConfig.appearanceOptions.maxSearchResultsPerPage,
            updatedConfig.appearanceOptions.searchResultHeight,
            updatedConfig.appearanceOptions.userInputHeight));
        updateMainWindowSize(0, updatedConfig.appearanceOptions);
        mainWindow.center();
        mainWindow.setResizable(false);
    }

    config = updatedConfig;
    configRepository.saveConfig(updatedConfig)
        .then(() => {
            searchEngine.updateConfig(updatedConfig)
                .then(() => refreshAllIndexes())
                .catch((err) =>  logger.error(err));
        })
        .catch((err) => logger.error(err));
};

const updateMainWindowSize = (searchResultCount: number, appearanceOptions: AppearanceOptions) => {
    mainWindow.setResizable(true);
    const windowHeight = searchResultCount > appearanceOptions.maxSearchResultsPerPage
        ? getMaxWindowHeight(appearanceOptions.maxSearchResultsPerPage, appearanceOptions.searchResultHeight, appearanceOptions.userInputHeight)
        : searchResultCount * appearanceOptions.searchResultHeight + appearanceOptions.userInputHeight;
    mainWindow.setSize(Number(appearanceOptions.windowWidth), Number(windowHeight));
    mainWindow.setResizable(false);
};

const reloadApp = () => {
    updateMainWindowSize(0, config.appearanceOptions);
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
        height: getMaxWindowHeight(config.appearanceOptions.maxSearchResultsPerPage, config.appearanceOptions.searchResultHeight, config.appearanceOptions.userInputHeight),
        resizable: false,
        show: false,
        skipTaskbar: true,
        transparent: true,
        width: config.appearanceOptions.windowWidth,
    });
    mainWindow.on("blur", hideMainWindow);
    mainWindow.on("closed", quitApp);
    mainWindow.loadFile(join(__dirname, "..", "main.html"));

    updateMainWindowSize(0, config.appearanceOptions);
    registerGlobalKeyboardShortcut(toggleMainWindow, config.generalOptions.hotKey);
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
    updateConfig(updatedConfig);
});

ipcMain.on(IpcChannels.search, (event: Electron.Event, userInput: string) => {
    searchEngine.getSearchResults(userInput)
        .then((result) => {
            updateMainWindowSize(result.length, config.appearanceOptions);
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
        settingsWindow = new BrowserWindow({
            height: 700,
            width: 850,
        });
        settingsWindow.setMenu(null);
        settingsWindow.loadFile(join(__dirname, "..", "settings.html"));
        settingsWindow.webContents.toggleDevTools();
    } else {
        settingsWindow.focus();
    }
});
