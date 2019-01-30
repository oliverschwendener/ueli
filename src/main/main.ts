import { app, BrowserWindow, ipcMain, globalShortcut } from "electron";
import { join } from "path";
import { IpcChannels } from "../common/ipc-channels";
import { SearchResultItem } from "../common/search-result-item";
import { getMacOsProductionSearchEngine, getWindowsProductionSearchEngine } from "./production/production-search-engine";
import { UserConfigOptions } from "../common/config/user-config-options";
import { ConsoleLogger } from "../common/logger/console-logger";
import { ElectronStoreConfigRepository } from "../common/config/electron-store-config-repository";
import { defaultUserConfigOptions } from "../common/config/default-user-config-options";
import { AppearanceOptions } from "../common/config/appearance-options";
import { isDev } from "../common/is-dev";
import { UeliCommand } from "./plugins/ueli-command-search-plugin/ueli-command";
import { UeliCommandExecutionArgument } from "./plugins/ueli-command-search-plugin/ueli-command-execution-argument";
import { platform } from "os";
import { OperatingSystem } from "../common/operating-system";

const logger = new ConsoleLogger();
const configRepository = new ElectronStoreConfigRepository(defaultUserConfigOptions);
const currentOperatingSystem = platform() === "darwin" ? OperatingSystem.macOS : OperatingSystem.Windows;

if (currentOperatingSystem === OperatingSystem.macOS) {
    app.dock.hide();
}

let mainWindow: BrowserWindow;
let settingsWindow: BrowserWindow;

let config = configRepository.getConfig();
let searchEngine = currentOperatingSystem === OperatingSystem.macOS ? getMacOsProductionSearchEngine(config) : getWindowsProductionSearchEngine(config);

function notifyRenderer(ipcChannel: IpcChannels, message?: string) {
    const allWindows = [mainWindow, settingsWindow];
    allWindows.forEach((window) => {
        if (window !== undefined && !window.isDestroyed()) {
            window.webContents.send(ipcChannel, message);
        }
    });
}

function refreshAllIndexes() {
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
}

let rescanInterval = setInterval(() => refreshAllIndexes(), Number(config.generalOptions.rescanIntervalInSeconds) * 1000);

function registerGlobalKeyboardShortcut(toggleAction: () => void, hotKey: string) {
    globalShortcut.unregisterAll();
    globalShortcut.register(hotKey, toggleAction);
}

function showMainWindow() {
    mainWindow.show();
    mainWindow.webContents.send(IpcChannels.mainWindowHasBeenShown);
}

function hideMainWindow() {
    mainWindow.webContents.send(IpcChannels.mainWindowHasBeenHidden);

    setTimeout(() => {
        updateMainWindowSize(0, config.appearanceOptions);
        mainWindow.hide();
    }, 25);
}

function toggleMainWindow() {
    if (mainWindow.isVisible()) {
        hideMainWindow();
    } else {
        showMainWindow();
    }
}

function getMaxWindowHeight(maxSearchResultsPerPage: number, searchResultHeight: number, userInputHeight: number): number {
    return Number(maxSearchResultsPerPage) * Number(searchResultHeight) + Number(userInputHeight);
}

function updateConfig(updatedConfig: UserConfigOptions, needsIndexRefresh: boolean) {
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

    if (JSON.stringify(updatedConfig.appearanceOptions) !== JSON.stringify(config.appearanceOptions)) {
        mainWindow.webContents.send(IpcChannels.appearanceOptionsUpdated, updatedConfig.appearanceOptions);
    }

    setAutoStartOptions(updatedConfig);

    config = updatedConfig;
    configRepository.saveConfig(updatedConfig)
        .then(() => {
            searchEngine.updateConfig(updatedConfig)
                .then(() => {
                    if (needsIndexRefresh) {
                        refreshAllIndexes();
                    } else {
                        notifyRenderer(IpcChannels.indexRefreshSucceeded, "Sucessfully updated config");
                    }
                })
                .catch((err) =>  logger.error(err));
        })
        .catch((err) => logger.error(err));
}

function updateMainWindowSize(searchResultCount: number, appearanceOptions: AppearanceOptions, center?: boolean) {
    mainWindow.setResizable(true);
    const windowHeight = searchResultCount > appearanceOptions.maxSearchResultsPerPage
        ? getMaxWindowHeight(appearanceOptions.maxSearchResultsPerPage, appearanceOptions.searchResultHeight, appearanceOptions.userInputHeight)
        : (Number(searchResultCount) * Number(appearanceOptions.searchResultHeight)) + Number(appearanceOptions.userInputHeight);

    mainWindow.setSize(Number(appearanceOptions.windowWidth), Number(windowHeight));
    if (center) {
        mainWindow.center();
    }
    mainWindow.setResizable(false);
}

function reloadApp() {
    updateMainWindowSize(0, config.appearanceOptions);
    searchEngine = currentOperatingSystem === OperatingSystem.macOS ? getMacOsProductionSearchEngine(config) : getWindowsProductionSearchEngine(config);
    mainWindow.reload();
}

function quitApp() {
    clearInterval(rescanInterval);
    globalShortcut.unregisterAll();
    app.quit();
}

function setAutoStartOptions (userConfig: UserConfigOptions) {
    if (!isDev()) {
        app.setLoginItemSettings({
            args: [],
            openAtLogin: userConfig.generalOptions.autostart,
            path: process.execPath,
        });
    }
}

function startApp() {
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

    const recenter = currentOperatingSystem === OperatingSystem.macOS;
    updateMainWindowSize(0, config.appearanceOptions, recenter);
    registerGlobalKeyboardShortcut(toggleMainWindow, config.generalOptions.hotKey);
    setAutoStartOptions(config);
    registerAllIpcListeners();
}

function openSettings() {
    if (!settingsWindow || settingsWindow.isDestroyed()) {
        settingsWindow = new BrowserWindow({
            height: 700,
            width: 850,
        });
        settingsWindow.setMenu(null);
        settingsWindow.loadFile(join(__dirname, "..", "settings.html"));
        if (isDev()) {
            settingsWindow.webContents.openDevTools();
        }
    } else {
        settingsWindow.focus();
    }
}

function registerAllIpcListeners() {
    ipcMain.on(IpcChannels.configUpdated, (event: Electron.Event, updatedConfig: UserConfigOptions, needsIndexRefresh: boolean) => {
        updateConfig(updatedConfig, needsIndexRefresh);
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
            .then(() => hideMainWindow())
            .catch((err) => logger.error(err));
    });

    ipcMain.on(IpcChannels.reloadApp, () => {
        reloadApp();
    });

    ipcMain.on(IpcChannels.openSettingsWindow, () => {
        openSettings();
    });

    ipcMain.on(IpcChannels.ueliCommandExecuted, (command: UeliCommand) => {
        switch (command.executionArgument) {
            case UeliCommandExecutionArgument.Exit:
                quitApp();
                break;
            case UeliCommandExecutionArgument.Reload:
                reloadApp();
                break;
            case UeliCommandExecutionArgument.EditConfigFile:
                configRepository.openConfigFile();
                break;
            case UeliCommandExecutionArgument.OpenSettings:
                openSettings();
                break;
            default:
                logger.error("Unhandled ueli command execution");
                break;
        }
    });
}

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
