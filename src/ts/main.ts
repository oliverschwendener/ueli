import { join } from "path";
import { platform } from "os";
import { app, BrowserWindow, globalShortcut, ipcMain, Menu, Tray, screen, MenuItemConstructorOptions } from "electron";
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
import { DefaultUserConfigManager } from "./user-config/default-config";
import { UserConfigFileRepository } from "./user-config/user-config-file-repository";
import { CountManager } from "./count/count-manager";
import { CountFileRepository } from "./count/count-file-repository";
import { ProductionIpcEmitter } from "./production-ipc-emitter";
import { AutoCompletionService } from "./auto-completion/autocompletion-service";
import { FilePathAutoCompletionValidator } from "./auto-completion/file-path-autocompletion-validator";
import { ElectronStoreAppConfigRepository } from "./app-config/electorn-store-app-config-repository";
import { AppConfig } from "./app-config/app-config";
import { UserConfigOptions } from "./user-config/user-config-options";
import { TimeHelpers } from "./helpers/time-helpers";
import { DefaultAppConfigManager } from "./app-config/default-app-config";
import { ProductionIconService } from "./icon-service/production-icon-service";
import { SearchResultItem } from "./search-result-item";
import { ProductionIconStore } from "./icon-service/production-icon-store";

let mainWindow: BrowserWindow;
let trayIcon: Tray;

const delayWhenHidingCommandlineOutputInMs = 25;
const filePathExecutor = new FilePathExecutor();
const appConfigRepository = new ElectronStoreAppConfigRepository(DefaultAppConfigManager.getDefaultAppConfig());
const userConfigRepository = new UserConfigFileRepository(DefaultUserConfigManager.getDefaultUserConfig(), appConfigRepository.getAppConfig().userSettingsFilePath);
let config = userConfigRepository.getConfig();
let inputValidationService = new InputValidationService(config, ProductionSearchers.getCombinations(config));
let iconStore = new ProductionIconStore();
const ipcEmitter = new ProductionIpcEmitter();
let executionService = new ExecutionService(
    ProductionExecutors.getCombinations(config),
    new CountManager(new CountFileRepository(UeliHelpers.countFilePath)),
    config,
    ipcEmitter);

const otherInstanceIsAlreadyRunning = app.makeSingleInstance((): void => { /* do nothing */ });
let rescanInterval = setInterval(initializeInputValidationService, TimeHelpers.convertSecondsToMilliseconds(config.rescanInterval));

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
        setupMacOsKeyboardShortcuts();
        checkForUpdates();
        setAutostartSettings();
    }
}

function createTrayIcon(): void {
    trayIcon = new Tray(Injector.getTrayIconPath(platform(), join(__dirname, "../")));
    trayIcon.setToolTip(UeliHelpers.productName);
    trayIcon.setContextMenu(Menu.buildFromTemplate([
        { click: showWindow, label: "Show" },
        {
            click: (): void => {
                showWindow();
                mainWindow.webContents.send(IpcChannels.showSettingsFromMain);
            },
            label: "Settings",
        },
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

function setupMacOsKeyboardShortcuts(): void {
    if (platform() === "darwin") {
        const template = [
            {
                label: UeliHelpers.productName,
                submenu: [
                    { label: "Quit", accelerator: "Command+Q", click: quitApp },
                    { label: "Reload", accelerator: "Command+R", click: reloadApp },
                ],
            },
            {
                label: "Edit",
                submenu: [
                    { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
                    { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
                    { type: "separator" },
                    { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
                    { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
                    { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
                    { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" },
                ],
            },
        ] as MenuItemConstructorOptions[];

        Menu.setApplicationMenu(Menu.buildFromTemplate(template));
    }
}

function checkForUpdates(): void {
    autoUpdater.autoDownload = false;
    autoUpdater.checkForUpdates();
}

function downloadUpdate(): void {
    autoUpdater.downloadUpdate();
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
    if (mainWindow !== undefined && !mainWindow.isDestroyed()) {
        const newWindowHeight = WindowHelpers.calculateWindowHeight(searchResultCount, config.maxSearchResultCount, config.userInputHeight, config.searchResultHeight);
        mainWindow.setSize(config.windowWidth, newWindowHeight);
    }
}

function setWindowHeightToMax(): void {
    mainWindow.setSize(config.windowWidth, config.windowMaxHeight);
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

    setTimeout((): void => {
        if (mainWindow !== null && mainWindow !== undefined) {
            updateWindowSize(0);
            mainWindow.hide();
        }
    }, delayWhenHidingCommandlineOutputInMs); // to give user input and command line output time to reset properly delay hiding window
}

function reloadApp(preventMainWindowReload?: boolean, preventWindowSizeReset?: boolean): void {
    config = new UserConfigFileRepository(DefaultUserConfigManager.getDefaultUserConfig(), appConfigRepository.getAppConfig().userSettingsFilePath).getConfig();
    inputValidationService = new InputValidationService(config, ProductionSearchers.getCombinations(config));
    executionService = new ExecutionService(
        ProductionExecutors.getCombinations(config),
        new CountManager(new CountFileRepository(UeliHelpers.countFilePath)),
        config,
        ipcEmitter);
    iconStore = new ProductionIconStore();

    if (!preventMainWindowReload) {
        mainWindow.reload();
    }

    if (!preventWindowSizeReset) {
        resetWindowToDefaultSizeAndPosition();
    } else {
        mainWindow.setSize(config.windowWidth, config.windowMaxHeight);
        mainWindow.center();
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

    mainWindow.webContents.send(IpcChannels.appReloaded);
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

function initializeInputValidationService(): void {
    inputValidationService = new InputValidationService(config, ProductionSearchers.getCombinations(config));
}

function setUpNewRescanInterval(): void {
    clearInterval(rescanInterval);
    rescanInterval = setInterval(initializeInputValidationService, TimeHelpers.convertSecondsToMilliseconds(config.rescanInterval));
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

ipcMain.on(IpcChannels.hideWindow, hideMainWindow);
ipcMain.on(IpcChannels.ueliReload, reloadApp);
ipcMain.on(IpcChannels.ueliExit, quitApp);
ipcMain.on(IpcChannels.ueliUpdateUeli, downloadUpdate);

ipcMain.on(IpcChannels.showSettingsFromMain, (): void => {
    mainWindow.webContents.send(IpcChannels.showSettingsFromMain);
});

ipcMain.on(IpcChannels.getSearch, (event: Electron.Event, userInput: string): void => {
    if (config.useNativeIcons) {
        const result = inputValidationService.getSearchResult(userInput);
        const iconService = new ProductionIconService(iconStore);
        const promises = result.map((r) => iconService.getProgramIcon(config.iconSet, r));

        Promise.all(promises).then((searchResults: SearchResultItem[]) => {
            updateWindowSize(result.length);
            event.sender.send(IpcChannels.getSearchResponse, searchResults);
        });
    } else {
        const result = inputValidationService.getSearchResult(userInput);
        event.sender.send(IpcChannels.getSearchResponse, result);
    }
});

ipcMain.on(IpcChannels.execute, (event: Electron.Event, executionArgument: string): void => {
    executionService.execute(executionArgument);
});

ipcMain.on(IpcChannels.openFileLocation, (event: Electron.Event, filePath: string): void => {
    if (new FilePathExecutionArgumentValidator().isValidForExecution(filePath)) {
        filePathExecutor.openFileLocation(filePath);
    }
});

ipcMain.on(IpcChannels.autoComplete, (event: Electron.Event, executionArgument: string): void => {
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

ipcMain.on(IpcChannels.updateAppConfig, (event: Electron.Event, updatedAppConfig: AppConfig): void => {
    appConfigRepository.setAppConfig(updatedAppConfig);
});

ipcMain.on(IpcChannels.updateUserConfig, (event: Electron.Event, updatedUserConfig: UserConfigOptions): void => {
    config = updatedUserConfig;
    setUpNewRescanInterval();
    userConfigRepository.saveConfig(updatedUserConfig);
    reloadApp(true, true);
});
