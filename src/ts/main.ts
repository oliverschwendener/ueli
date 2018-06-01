import { app, BrowserWindow, globalShortcut, ipcMain, Menu, MenuItem, Tray } from "electron";
import { autoUpdater } from "electron-updater";
import * as fs from "fs";
import * as path from "path";
import { FilePathExecutionArgumentValidator } from "./execution-argument-validators/file-path-execution-argument-validator";
import { ExecutionService } from "./execution-service";
import { FilePathExecutor } from "./executors/file-path-executor";
import { Injector } from "./injector";
import { InputValidationService } from "./input-validation-service";
import { SearchEngine } from "./search-engine";
import { IpcChannels } from "./ipc-channels";
import { OperatingSystem } from "./operating-system";
import * as isInDevelopment from "electron-is-dev";
import { platform } from "os";
import { WindowHelpers } from "./helpers/winow-helpers";
import { ExecutionArgumentValidatorExecutorCombinationManager } from "./execution-argument-validator-executor-combination-manager";
import { InputValidatorSearcherCombinationManager } from "./input-validator-searcher-combination-manager";
import { UeliHelpers } from "./helpers/ueli-helpers";
import { WebUrlExecutor } from "./executors/web-url-executor";
import { defaultConfig } from "./default-config";
import { ConfigFileRepository } from "./config-file-repository";
import { CountManager } from "./count-manager";
import { CountFileRepository } from "./count-file-repository";

let mainWindow: BrowserWindow;
let trayIcon: Tray;
const delayWhenHidingCommandlineOutputInMs = 25;

const filePathExecutor = new FilePathExecutor();

let config = new ConfigFileRepository(defaultConfig, UeliHelpers.configFilePath).getConfig();
let inputValidationService = new InputValidationService(new InputValidatorSearcherCombinationManager(config).getCombinations());
let executionService = new ExecutionService(
    new ExecutionArgumentValidatorExecutorCombinationManager(config).getCombinations(),
    new CountManager(new CountFileRepository(UeliHelpers.countFilePath)),
    config);

const otherInstanceIsAlreadyRunning = app.makeSingleInstance(() => {
    // do nothing
});

if (otherInstanceIsAlreadyRunning) {
    app.quit();
} else {
    startApp();
}

function startApp(): void {
    app.on("ready", createMainWindow);
    app.on("window-all-closed", quitApp);
}

function createMainWindow(): void {
    hideAppInDock();

    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        backgroundColor: "#00000000",
        center: true,
        frame: false,
        height: WindowHelpers.calculateMaxWindowHeight(config.userInputHeight, config.maxSearchResultCount, config.searchResultHeight),
        resizable: false,
        show: false,
        skipTaskbar: true,
        width: config.windowWith,
    });

    mainWindow.loadURL(`file://${__dirname}/../main.html`);
    mainWindow.setSize(config.windowWith, config.userInputHeight);

    mainWindow.on("close", quitApp);
    mainWindow.on("blur", hideMainWindow);

    createTrayIcon();
    registerGlobalShortcuts();

    if (!isInDevelopment) {
        checkForUpdates();
        setAutostartSettings();
    }
}

function createTrayIcon(): void {
    trayIcon = new Tray(Injector.getTrayIconPath(platform(), path.join(__dirname, "../")));
    trayIcon.setToolTip(UeliHelpers.productName);
    trayIcon.setContextMenu(Menu.buildFromTemplate([
        {
            click: toggleWindow,
            label: "Show/Hide",
        },
        {
            click: quitApp,
            label: "Exit",
        },
    ]));
}

function registerGlobalShortcuts(): void {
    globalShortcut.register(config.hotKey, toggleWindow);
}

function unregisterGlobalShortcuts(): void {
    globalShortcut.unregisterAll();
}

function hideAppInDock(): void {
    if (platform() === "darwin") {
        app.dock.hide();
    }
}

function checkForUpdates(): void {
    autoUpdater.autoDownload = false;
    autoUpdater.checkForUpdates();
}

function downloadUpdate(): void {
    autoUpdater.downloadUpdate();
    addUpdateStatusToTrayIcon("Downloading update...");
}

autoUpdater.on("update-available", (): void => {
    addUpdateStatusToTrayIcon("Download and install update", downloadUpdate);
});

autoUpdater.on("error", (): void => {
    addUpdateStatusToTrayIcon("Update check failed");
});

autoUpdater.on("update-not-available", (): void => {
    addUpdateStatusToTrayIcon(`${UeliHelpers.productName} is up to date`);
});

autoUpdater.on("update-downloaded", (): void => {
    autoUpdater.quitAndInstall();
});

function setAutostartSettings() {
    app.setLoginItemSettings({
        args: [],
        openAtLogin: config.autoStartApp,
        path: process.execPath,
    });
}

function addUpdateStatusToTrayIcon(label: string, clickHandler?: any): void {
    const updateItem = clickHandler === undefined
        ? { label }
        : { label, click: clickHandler } as MenuItem;

    trayIcon.setContextMenu(Menu.buildFromTemplate([
        updateItem,
        {
            click: toggleWindow,
            label: "Show/Hide",
        },
        {
            click: quitApp,
            label: "Exit",
        },
    ]));
}

function toggleWindow(): void {
    if (mainWindow.isVisible()) {
        hideMainWindow();
    } else {
        mainWindow.show();
    }
}

function updateWindowSize(searchResultCount: number): void {
    const newWindowHeight = WindowHelpers.calculateWindowHeight(searchResultCount, config.maxSearchResultCount, config.userInputHeight, config.searchResultHeight);
    mainWindow.setSize(config.windowWith, newWindowHeight);
}

function hideMainWindow(): void {
    mainWindow.webContents.send(IpcChannels.resetCommandlineOutput);
    mainWindow.webContents.send(IpcChannels.resetUserInput);

    setTimeout(() => {
        if (mainWindow !== null && mainWindow !== undefined) {
            updateWindowSize(0);
            mainWindow.hide();
        }
    }, delayWhenHidingCommandlineOutputInMs); // to give user input and command line output time to reset properly delay hiding window
}

function reloadApp(): void {
    unregisterGlobalShortcuts();

    config = new ConfigFileRepository(defaultConfig, UeliHelpers.configFilePath).getConfig();
    inputValidationService = new InputValidationService(new InputValidatorSearcherCombinationManager(config).getCombinations());
    executionService = new ExecutionService(
        new ExecutionArgumentValidatorExecutorCombinationManager(config).getCombinations(),
        new CountManager(new CountFileRepository(UeliHelpers.countFilePath)),
        config);

    mainWindow.reload();
    resetWindowToDefaultSizeAndPosition();
    registerGlobalShortcuts();
}

function resetWindowToDefaultSizeAndPosition(): void {
    mainWindow.setSize(config.windowWith, WindowHelpers.calculateMaxWindowHeight(config.userInputHeight, config.maxSearchResultCount, config.searchResultHeight));
    mainWindow.center();
    updateWindowSize(0);
}

function quitApp(): void {
    trayIcon.destroy();
    unregisterGlobalShortcuts();
    app.quit();
}

ipcMain.on(IpcChannels.hideWindow, hideMainWindow);
ipcMain.on(IpcChannels.ueliReload, reloadApp);
ipcMain.on(IpcChannels.ueliExit, quitApp);

ipcMain.on(IpcChannels.getSearch, (event: any, arg: string): void => {
    const userInput = arg;
    const result = inputValidationService.getSearchResult(userInput);
    updateWindowSize(result.length);
    event.sender.send(IpcChannels.getSearchResponse, result);
});

ipcMain.on(IpcChannels.execute, (event: any, arg: string): void => {
    const executionArgument = arg;
    executionService.execute(executionArgument);
});

ipcMain.on(IpcChannels.openFileLocation, (event: any, arg: string): void => {
    const filePath = arg;
    if (new FilePathExecutionArgumentValidator().isValidForExecution(filePath)) {
        filePathExecutor.openFileLocation(filePath);
    }
});

ipcMain.on(IpcChannels.autoComplete, (event: any, arg: string[]): void => {
    const userInput = arg[0];
    let executionArgument = arg[1];
    const dirSeparator = Injector.getDirectorySeparator(platform());

    if (new FilePathExecutionArgumentValidator().isValidForExecution(userInput)) {
        if (!executionArgument.endsWith(dirSeparator) && fs.lstatSync(executionArgument).isDirectory()) {
            executionArgument = `${executionArgument}${dirSeparator}`;
        }

        event.sender.send(IpcChannels.autoCompleteResponse, executionArgument);
    }
});

ipcMain.on(IpcChannels.getSearchIcon, (event: any): void => {
    const iconManager = Injector.getIconManager(platform());
    event.sender.send(IpcChannels.getSearchIconResponse, iconManager.getSearchIcon());
});

ipcMain.on(IpcChannels.commandLineExecution, (arg: string): void => {
    mainWindow.webContents.send(IpcChannels.commandLineOutput, arg);
    updateWindowSize(config.maxSearchResultCount);
});

ipcMain.on(IpcChannels.resetUserInput, (): void => {
    mainWindow.webContents.send(IpcChannels.resetUserInput);
});

ipcMain.on(IpcChannels.showHelp, (): void => {
    new WebUrlExecutor().execute("https://github.com/oliverschwendener/ueli#ueli");
});

ipcMain.on(IpcChannels.ueliCheckForUpdates, (): void => {
    autoUpdater.checkForUpdates();
});
