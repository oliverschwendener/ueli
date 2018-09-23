import { join } from "path";
import { platform } from "os";
import { app, BrowserWindow, globalShortcut, ipcMain, Menu, Tray, screen } from "electron";
import { autoUpdater } from "electron-updater";
import { FilePathExecutionArgumentValidator } from "./execution-argument-validators/file-path-execution-argument-validator";
import { ExecutionService } from "./execution-service";
import { FilePathExecutor } from "./executors/file-path-executor";
import { Injector } from "./injector";
import { InputValidationService } from "./input-validation-service";
import { IpcChannels } from "./ipc-channels";
import * as isInDevelopment from "electron-is-dev";
import { WindowHelpers } from "./helpers/winow-helpers";
import { ProductionExecutors } from "./production/production-executors";
import { ProductionSearchers } from "./production/production-searchers";
import { UeliHelpers } from "./helpers/ueli-helpers";
import { defaultConfig } from "./user-config/default-config";
import { UserConfigFileRepository } from "./user-config/user-config-file-repository";
import { CountManager } from "./count/count-manager";
import { CountFileRepository } from "./count/count-file-repository";
import { ProductionIpcEmitter } from "./production-ipc-emitter";
import { AutoCompletionService } from "./auto-completion/autocompletion-service";
import { FilePathAutoCompletionValidator } from "./auto-completion/file-path-autocompletion-validator";
import { ElectronStoreAppConfigRepository } from "./app-config/electorn-store-app-config-repository";
import { AppConfig } from "./app-config/app-config";
import { UserConfigOptions } from "./user-config/user-config-options";

let mainWindow: BrowserWindow;
let trayIcon: Tray;

const delayWhenHidingCommandlineOutputInMs = 25;
const filePathExecutor = new FilePathExecutor();
const appConfigRepository = new ElectronStoreAppConfigRepository();
const userConfigRepository = new UserConfigFileRepository(defaultConfig, appConfigRepository.getAppConfig().userSettingsFilePath);
let config = userConfigRepository.getConfig();
let inputValidationService = new InputValidationService(config, ProductionSearchers.getCombinations(config));
const ipcEmitter = new ProductionIpcEmitter();
let executionService = new ExecutionService(
    ProductionExecutors.getCombinations(config),
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
        width: config.windowWidth,
    });

    mainWindow.loadURL(`file://${__dirname}/../main.html`);
    setWindowHeightToMax();

    mainWindow.on("close", quitApp);
    mainWindow.on("blur", hideMainWindow);

    if (config.showTrayIcon) {
        createTrayIcon();
    }

    registerGlobalHotKey();

    if (!isInDevelopment) {
        checkForUpdates();
        setAutostartSettings();
    }
}

function createTrayIcon(): void {
    trayIcon = new Tray(Injector.getTrayIconPath(platform(), join(__dirname, "../")));
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
    mainWindow.webContents.send(IpcChannels.ueliUpdateWasFound);
});

autoUpdater.on("update-not-available", (): void => {
    mainWindow.webContents.send(IpcChannels.ueliNoUpdateWasFound);
});

autoUpdater.on("error", (): void => {
    mainWindow.webContents.send(IpcChannels.ueliUpdateCheckError);
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

function toggleWindow(): void {
    if (mainWindow.isVisible()) {
        hideMainWindow();
    } else {
        showWindow();
    }
}

function updateWindowSize(searchResultCount: number): void {
    if (mainWindow !== undefined && !mainWindow.isDestroyed()) {
        const newWindowHeight = WindowHelpers.calculateWindowHeight(searchResultCount, config.maxSearchResultCount, config.userInputHeight, config.searchResultHeight);
        mainWindow.setSize(config.windowWidth, newWindowHeight);
    }
}

function setWindowHeightToMax(): void {
    mainWindow.setSize(config.windowWidth, config.maxWindowHeight);
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
    mainWindow.webContents.send(IpcChannels.hideSettings);

    setTimeout(() => {
        if (mainWindow !== null && mainWindow !== undefined) {
            updateWindowSize(0);
            mainWindow.hide();
        }
    }, delayWhenHidingCommandlineOutputInMs); // to give user input and command line output time to reset properly delay hiding window
}

function reloadApp(preventMainWindowReload?: boolean): void {
    config = new UserConfigFileRepository(defaultConfig, appConfigRepository.getAppConfig().userSettingsFilePath).getConfig();
    inputValidationService = new InputValidationService(config, ProductionSearchers.getCombinations(config));
    executionService = new ExecutionService(
        ProductionExecutors.getCombinations(config),
        new CountManager(new CountFileRepository(UeliHelpers.countFilePath)),
        config,
        ipcEmitter);

    if (!preventMainWindowReload) {
        mainWindow.reload();
        resetWindowToDefaultSizeAndPosition();
    }

    unregisterAllGlobalShortcuts();
    registerGlobalHotKey();

    if (config.showTrayIcon) {
        if (trayIcon === undefined || trayIcon.isDestroyed()) {
            createTrayIcon();
        }
    } else {
        if (trayIcon !== undefined && !trayIcon.isDestroyed()) {
            destroyTrayIcon();
        }
    }

    if (!isInDevelopment) {
        setAutostartSettings();
    }
}

function destroyTrayIcon(): void {
    if (trayIcon !== undefined) {
        trayIcon.destroy();
    }
}

function resetWindowToDefaultSizeAndPosition(): void {
    setWindowHeightToMax();
    mainWindow.center();
    updateWindowSize(0);
}

function quitApp(): void {
    destroyTrayIcon();
    unregisterAllGlobalShortcuts();
    app.quit();
}

ipcMain.on(IpcChannels.hideWindow, hideMainWindow);
ipcMain.on(IpcChannels.ueliReload, reloadApp);
ipcMain.on(IpcChannels.ueliExit, quitApp);
ipcMain.on(IpcChannels.ueliUpdateUeli, downloadUpdate);

ipcMain.on(IpcChannels.showSettingsFromMain, (): void => {
    mainWindow.webContents.send(IpcChannels.showSettingsFromMain);
});

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
    const autoCompletionResult = new AutoCompletionService([
        new FilePathAutoCompletionValidator(),
    ]).getAutocompletionResult(executionArgument);

    if (autoCompletionResult !== undefined) {
        event.sender.send(IpcChannels.autoCompleteResponse, autoCompletionResult);
    }
});

ipcMain.on(IpcChannels.commandLineExecution, (arg: string): void => {
    mainWindow.webContents.send(IpcChannels.commandLineOutput, arg);
    setWindowHeightToMax();
});

ipcMain.on(IpcChannels.resetUserInput, (): void => {
    mainWindow.webContents.send(IpcChannels.resetUserInput);
});

ipcMain.on(IpcChannels.ueliCheckForUpdates, (): void => {
    autoUpdater.checkForUpdates();
});

ipcMain.on(IpcChannels.showSettingsFromRenderer, (): void => {
    setWindowHeightToMax();
});

ipcMain.on(IpcChannels.hideSettings, (): void => {
    updateWindowSize(0);
});

ipcMain.on(IpcChannels.updateAppConfig, (event: Electron.Event, updatedAppConfig: AppConfig) => {
    appConfigRepository.setAppConfig(updatedAppConfig);
});

ipcMain.on(IpcChannels.updateUserConfig, (event: Electron.Event, updatedUserConfig: UserConfigOptions) => {
    config = updatedUserConfig;
    userConfigRepository.saveConfig(updatedUserConfig);
    reloadApp(true);
});
