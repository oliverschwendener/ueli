import { app, BrowserWindow, globalShortcut, ipcMain, Menu, MenuItem, Tray, screen } from "electron";
import { autoUpdater } from "electron-updater";
import * as fs from "fs";
import * as path from "path";
import { FilePathExecutionArgumentValidator } from "./execution-argument-validators/file-path-execution-argument-validator";
import { ExecutionService } from "./execution-service";
import { FilePathExecutor } from "./executors/file-path-executor";
import { Injector } from "./injector";
import { InputValidationService } from "./input-validation-service";
import { IpcChannels } from "./ipc-channels";
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
import { ProductionIpcEmitter } from "./production-ipc-emitter";

let mainWindow: BrowserWindow;
let trayIcon: Tray;
const delayWhenHidingCommandlineOutputInMs = 25;

const filePathExecutor = new FilePathExecutor();

let config = new ConfigFileRepository(defaultConfig, UeliHelpers.configFilePath).getConfig();
let inputValidationService = new InputValidationService(config, new InputValidatorSearcherCombinationManager(config).getCombinations());
const ipcEmitter = new ProductionIpcEmitter();
let executionService = new ExecutionService(
    new ExecutionArgumentValidatorExecutorCombinationManager(config).getCombinations(),
    new CountManager(new CountFileRepository(UeliHelpers.countFilePath)),
    config,
    ipcEmitter);

const otherInstanceIsAlreadyRunning = app.makeSingleInstance(() => { /* do nothing */ });

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

    if (config.showTrayIcon) {
        createTrayIcon();
    }

    registerGlobalHotKey();
    watchConfigFile();

    if (!isInDevelopment) {
        checkForUpdates();
        setAutostartSettings();
    }
}

function createTrayIcon(): void {
    trayIcon = new Tray(Injector.getTrayIconPath(platform(), path.join(__dirname, "../")));
    trayIcon.setToolTip(UeliHelpers.productName);
    trayIcon.setContextMenu(Menu.buildFromTemplate([
        { click: showWindow, label: "Show" },
        { click: quitApp, label: "Exit" },
    ]));
}

function registerGlobalHotKey(): void {
    globalShortcut.register(config.hotKey, toggleWindow);
}

function unregisterAllGlobalShortcuts(): void {
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
}

autoUpdater.on("update-available", (): void => {
    addUpdateStatusToTrayIcon("Update is available");
    ipcMain.emit(IpcChannels.ueliUpdateWasFound);
});

autoUpdater.on("update-not-available", (): void => {
    addUpdateStatusToTrayIcon(`${UeliHelpers.productName} is up to date`);
});

autoUpdater.on("error", (): void => {
    addUpdateStatusToTrayIcon("Update check failed");
});

autoUpdater.on("update-downloaded", (): void => {
    autoUpdater.quitAndInstall();
});

function addUpdateStatusToTrayIcon(label: string, clickHandler?: any): void {
    const updateItem = clickHandler === undefined
        ? { label }
        : { label, click: clickHandler } as MenuItem;

    if (trayIcon !== undefined) {
        trayIcon.setContextMenu(Menu.buildFromTemplate([
            updateItem,
            { click: toggleWindow, label: "Show/Hide" },
            { click: quitApp, label: "Exit" },
        ]));
    }
}

function setAutostartSettings() {
    app.setLoginItemSettings({
        args: [],
        openAtLogin: config.autoStartApp,
        path: process.execPath,
    });
}

function toggleWindow(): void {
    if (mainWindow.isVisible()) {
        hideMainWindow();
    } else {
        showWindow();
    }
}

function updateWindowSize(searchResultCount: number): void {
    const newWindowHeight = WindowHelpers.calculateWindowHeight(searchResultCount, config.maxSearchResultCount, config.userInputHeight, config.searchResultHeight);
    mainWindow.setSize(config.windowWith, newWindowHeight);
}

function showWindow() {
    if (!config.alwaysShowOnPrimaryDisplay) {
        const mousePosition = screen.getCursorScreenPoint();
        const nearestDisplay = screen.getDisplayNearestPoint(mousePosition);
        mainWindow.setBounds(nearestDisplay.bounds);
    }
    resetWindowToDefaultSizeAndPosition();
    mainWindow.show();
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
    config = new ConfigFileRepository(defaultConfig, UeliHelpers.configFilePath).getConfig();
    inputValidationService = new InputValidationService(config, new InputValidatorSearcherCombinationManager(config).getCombinations());
    executionService = new ExecutionService(
        new ExecutionArgumentValidatorExecutorCombinationManager(config).getCombinations(),
        new CountManager(new CountFileRepository(UeliHelpers.countFilePath)),
        config,
        ipcEmitter);

    mainWindow.reload();
    resetWindowToDefaultSizeAndPosition();
    unregisterAllGlobalShortcuts();
    registerGlobalHotKey();

    if (config.showTrayIcon) {
        createTrayIcon();
    } else {
        destroyTrayIcon();
    }
}

function destroyTrayIcon(): void {
    if (trayIcon !== undefined) {
        trayIcon.destroy();
    }
}

function resetWindowToDefaultSizeAndPosition(): void {
    mainWindow.setSize(config.windowWith, WindowHelpers.calculateMaxWindowHeight(config.userInputHeight, config.maxSearchResultCount, config.searchResultHeight));
    mainWindow.center();
    updateWindowSize(0);
}

function watchConfigFile(): void {
    fs.watchFile(UeliHelpers.configFilePath, reloadApp);
}

function unwatchConfigFile(): void {
    fs.unwatchFile(UeliHelpers.configFilePath);
}

function quitApp(): void {
    unwatchConfigFile();
    destroyTrayIcon();
    unregisterAllGlobalShortcuts();
    app.quit();
}

ipcMain.on(IpcChannels.hideWindow, hideMainWindow);
ipcMain.on(IpcChannels.ueliReload, reloadApp);
ipcMain.on(IpcChannels.ueliExit, quitApp);
ipcMain.on(IpcChannels.ueliUpdateUeli, downloadUpdate);

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

ipcMain.on(IpcChannels.autoComplete, (event: any, executionArgument: string): void => {
    const dirSeparator = Injector.getDirectorySeparator(platform());
    const validator = new FilePathExecutionArgumentValidator();

    if (validator.isValidForExecution(executionArgument)) {
        if (!executionArgument.endsWith(dirSeparator) && fs.lstatSync(executionArgument).isDirectory()) {
            executionArgument = `${executionArgument}${dirSeparator}`;
        }

        event.sender.send(IpcChannels.autoCompleteResponse, executionArgument);
    }
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
