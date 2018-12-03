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
import { AppIconService } from "./icon-service/app-icon-service";
import { MacOsAppIconStore } from "./icon-service/mac-os-app-icon-store";
import { OperatingSystemHelpers } from "./helpers/operating-system-helpers";
import { OperatingSystem } from "./operating-system";
import { WindowsAppIconStore } from "./icon-service/windows-app-icon-store";
import { AppIconStore } from "./icon-service/app-icon-store";
import { FileIconService } from "./icon-service/file-icon-service";

let mainWindow: BrowserWindow;
let trayIcon: Tray;

const currentOperatingSystem = OperatingSystemHelpers.getOperatingSystemFromString(platform());

const delayWhenHidingCommandlineOutputInMs = 25;
const filePathExecutor = new FilePathExecutor();
let appConfig = new ElectronStoreAppConfigRepository(DefaultAppConfigManager.getDefaultAppConfig()).getAppConfig();
const userConfigRepository = new UserConfigFileRepository(DefaultUserConfigManager.getDefaultUserConfig(), appConfig.userSettingsFilePath);
let config = userConfigRepository.getConfig();

let appIconStore: AppIconStore = getAppIconStore();

let inputValidationService = new InputValidationService(config, ProductionSearchers.getCombinations(config, appConfig, appIconStore));
const ipcEmitter = new ProductionIpcEmitter();
let executionService = new ExecutionService(
    ProductionExecutors.getCombinations(config),
    new CountManager(new CountFileRepository(appConfig.countFilePath)),
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
    trayIcon = new Tray(Injector.getTrayIconPath(currentOperatingSystem, join(__dirname, "../")));
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
    if (currentOperatingSystem === OperatingSystem.macOS) {
        app.dock.hide();
    }
}

function setupMacOsKeyboardShortcuts(): void {
    if (currentOperatingSystem === OperatingSystem.macOS) {
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
    appConfig = new ElectronStoreAppConfigRepository(DefaultAppConfigManager.getDefaultAppConfig()).getAppConfig();
    appIconStore = getAppIconStore();
    config = new UserConfigFileRepository(DefaultUserConfigManager.getDefaultUserConfig(), appConfig.userSettingsFilePath).getConfig();
    inputValidationService = new InputValidationService(config, ProductionSearchers.getCombinations(config, appConfig, appIconStore));
    executionService = new ExecutionService(
        ProductionExecutors.getCombinations(config),
        new CountManager(new CountFileRepository(appConfig.countFilePath)),
        config,
        ipcEmitter);

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
    inputValidationService = new InputValidationService(config, ProductionSearchers.getCombinations(config, appConfig, appIconStore));
}

function setUpNewRescanInterval(): void {
    clearInterval(rescanInterval);
    rescanInterval = setInterval(initializeInputValidationService, TimeHelpers.convertSecondsToMilliseconds(config.rescanInterval));
}

function getAppIconStore(): AppIconStore {
    return currentOperatingSystem === OperatingSystem.Windows
        ? new WindowsAppIconStore(appConfig.appIconStorePath, config.iconSet)
        : new MacOsAppIconStore(appConfig.appIconStorePath, config.iconSet);
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
        const iconService = new AppIconService(appIconStore);
        const fileIconService = new FileIconService(config.iconSet);
        const appIconPromises = result
            .filter((r) => r.icon === config.iconSet.appIcon)
            .map((r) => iconService.getProgramIcon(r));

        const fileIconPromises = result
            .filter((r) => r.icon === config.iconSet.fileIcon)
            .map((r) => fileIconService.getFileIcon(r));

        Promise.all(fileIconPromises).then((resultsWithFileIcon) => {
            for (const resultWithFileIcon of resultsWithFileIcon) {
                const resultItem = result.find((r) => r.executionArgument === resultWithFileIcon.executionArgument && r.icon === config.iconSet.fileIcon);
                if (resultItem !== undefined) {
                    resultItem.icon = resultWithFileIcon.icon;
                }
            }

            Promise.all(appIconPromises).then((resultsWithAppIcon) => {
                for (const resultWithAppIcon of resultsWithAppIcon) {
                    const resultItem = result.find((r) => r.executionArgument === resultWithAppIcon.executionArgument && r.icon === config.iconSet.appIcon);
                    if (resultItem !== undefined) {
                        resultItem.icon = resultWithAppIcon.icon;
                    }
                }

                updateWindowSize(result.length);
                event.sender.send(IpcChannels.getSearchResponse, result);
            });
        });
    } else {
        const result = inputValidationService.getSearchResult(userInput);
        updateWindowSize(result.length);
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
    const appConfigRepo = new ElectronStoreAppConfigRepository(DefaultAppConfigManager.getDefaultAppConfig());
    appConfigRepo.setAppConfig(updatedAppConfig);
    appConfig = appConfigRepo.getAppConfig();
});

ipcMain.on(IpcChannels.updateUserConfig, (event: Electron.Event, updatedUserConfig: UserConfigOptions): void => {
    config = updatedUserConfig;
    setUpNewRescanInterval();
    userConfigRepository.saveConfig(updatedUserConfig);
    reloadApp(true, true);
});
