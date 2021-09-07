import {
    app,
    BrowserWindow,
    ipcMain,
    globalShortcut,
    dialog,
    Tray,
    Menu,
    screen,
    MenuItemConstructorOptions,
    WebContents,
} from "electron";
import { autoUpdater } from "electron-updater";
import { join } from "path";
import { IpcChannels } from "../common/ipc-channels";
import { SearchResultItem } from "../common/search-result-item";
import { UserConfigOptions } from "../common/config/user-config-options";
import { ElectronStoreConfigRepository } from "../common/config/electron-store-config-repository";
import { defaultUserConfigOptions } from "../common/config/user-config-options";
import { AppearanceOptions } from "../common/config/appearance-options";
import { isDev } from "../common/is-dev";
import { UeliCommand } from "./plugins/ueli-command-search-plugin/ueli-command";
import { UeliCommandExecutionArgument } from "./plugins/ueli-command-search-plugin/ueli-command-execution-argument";
import { platform, release } from "os";
import { getProductionSearchEngine } from "./production/production-search-engine";
import { GlobalHotKey } from "../common/global-hot-key/global-hot-key";
import { defaultGeneralOptions } from "../common/config/general-options";
import { getErrorSearchResultItem } from "../common/error-search-result-item";
import { FileHelpers } from "./../common/helpers/file-helpers";
import { ueliTempFolder, logFilePath } from "../common/helpers/ueli-helpers";
import { getTranslationSet } from "../common/translation/translation-set-manager";
import { trayIconPathWindows, trayIconPathMacOs } from "./helpers/tray-icon-helpers";
import { isValidHotKey } from "../common/global-hot-key/global-hot-key-helpers";
import { NotificationType } from "../common/notification-type";
import { UserInputHistoryManager } from "./user-input-history-manager";
import { getCurrentOperatingSystem, getOperatingSystemVersion } from "../common/helpers/operating-system-helpers";
import { executeFilePathWindows, executeFilePathMacOs } from "./executors/file-path-executor";
import { UpdateCheckResult } from "../common/update-check-result";
import { ProductionLogger } from "../common/logger/production-logger";
import { DevLogger } from "../common/logger/dev-logger";
import { windowIconWindows, windowIconMacOs } from "./helpers/window-icon-helpers";
import { toHex } from "./plugins/color-converter-plugin/color-converter-helpers";
import { deepCopy } from "../common/helpers/object-helpers";
import { PluginType } from "./plugin-type";
import { getRescanIntervalInMilliseconds } from "./helpers/rescan-interval-helpers";
import { openUrlInBrowser } from "./executors/url-executor";
import { OperatingSystem } from "../common/operating-system";
import { GlobalHotKeyModifier } from "../common/global-hot-key/global-hot-key-modifier";
import { GlobalHotKeyKey } from "../common/global-hot-key/global-hot-key-key";

if (!FileHelpers.fileExistsSync(ueliTempFolder)) {
    FileHelpers.createFolderSync(ueliTempFolder);
}

const operatingSystem = getCurrentOperatingSystem(platform());
const operatingSystemVersion = getOperatingSystemVersion(operatingSystem, release());
const appIsInDevelopment = isDev(process.execPath);
const minimumRefreshIntervalInSeconds = 10;
const configRepository = new ElectronStoreConfigRepository(deepCopy(defaultUserConfigOptions));
const filePathExecutor = operatingSystem === OperatingSystem.Windows ? executeFilePathWindows : executeFilePathMacOs;
const trayIconFilePath = operatingSystem === OperatingSystem.Windows ? trayIconPathWindows : trayIconPathMacOs;
const windowIconFilePath = operatingSystem === OperatingSystem.Windows ? windowIconWindows : windowIconMacOs;
const userInputHistoryManager = new UserInputHistoryManager();
const releaseUrl = "https://github.com/oliverschwendener/ueli/releases/latest";
const windowsPowerShellPath = "C:\\Windows\\System32\\WindowsPowerShell\\v1.0";

autoUpdater.autoDownload = false;

if (operatingSystem === OperatingSystem.macOS) {
    app.dock.hide();
}

if (operatingSystem === OperatingSystem.Windows) {
    addPowershellToPathVariableIfMissing();
}

if (operatingSystem === OperatingSystem.Windows) {
    // Fix to prevent the app to flash twice on Windows
    // https://github.com/electron/electron/issues/22691
    app.commandLine.appendSwitch("wm-window-animations-disabled");
}

let config = configRepository.getConfig();

let trayIcon: Tray;
let mainWindow: BrowserWindow;
let settingsWindow: BrowserWindow;
let lastWindowPosition = config.generalOptions.lastWindowPosition;
let lastSearchUserInput: string | undefined;

let translationSet = getTranslationSet(config.generalOptions.language);
const logger = appIsInDevelopment ? new DevLogger() : new ProductionLogger(logFilePath, filePathExecutor);
let searchEngine = getProductionSearchEngine(operatingSystem, operatingSystemVersion, config, translationSet, logger);

let rescanInterval = config.generalOptions.rescanEnabled
    ? setInterval(
          () => refreshAllIndexes(),
          getRescanIntervalInMilliseconds(
              Number(config.generalOptions.rescanIntervalInSeconds),
              minimumRefreshIntervalInSeconds,
          ),
      )
    : undefined;

function notifyRenderer(message: string, notificationType: NotificationType) {
    BrowserWindow.getAllWindows().forEach((window) => {
        if (windowExists(window)) {
            window.webContents.send(IpcChannels.notification, message, notificationType);
        }
    });
}

function refreshAllIndexes() {
    onIndexRefreshStarted();
    searchEngine
        .refreshAllIndexes()
        .then(() => {
            logger.debug("Successfully refreshed all indexes");
            notifyRenderer(translationSet.successfullyRefreshedIndexes, NotificationType.Info);
        })
        .catch((err) => {
            logger.error(err);
            notifyRenderer(err, NotificationType.Error);
        })
        .finally(onIndexRefreshFinished);
}

function refreshIndexOfPlugin(pluginType: PluginType) {
    onIndexRefreshStarted();
    searchEngine
        .refreshIndexByPlugin(pluginType)
        .then(() => {
            logger.debug(`Successfully refresh index of plugin ${pluginType.toString()}`);
            notifyRenderer(translationSet.successfullyRefreshedIndexes, NotificationType.Info);
        })
        .catch((err) => {
            logger.error(err);
            notifyRenderer(err, NotificationType.Error);
        })
        .finally(onIndexRefreshFinished);
}

function onIndexRefreshStarted() {
    BrowserWindow.getAllWindows().forEach((window) => window.webContents.send(IpcChannels.refreshIndexesStarted));
}

function onIndexRefreshFinished() {
    BrowserWindow.getAllWindows().forEach((window) => window.webContents.send(IpcChannels.refreshIndexesCompleted));
}

function clearAllCaches() {
    searchEngine
        .clearCaches()
        .then(() => {
            logger.debug("Successfully cleared caches");
            notifyRenderer(translationSet.successfullyClearedCaches, NotificationType.Info);
        })
        .catch((err) => logger.error(err));
}

function registerGlobalKeyboardShortcut(toggleAction: () => void, newHotKey: GlobalHotKey) {
    newHotKey = isValidHotKey(newHotKey) ? newHotKey : defaultGeneralOptions.hotKey;
    globalShortcut.unregisterAll();

    const hotKeyParts: (GlobalHotKeyKey | GlobalHotKeyModifier)[] = [];

    // Add first key modifier, if any
    if (newHotKey.modifier && newHotKey.modifier !== GlobalHotKeyModifier.None) {
        hotKeyParts.push(newHotKey.modifier);
    }

    // Add second key modifier, if any
    if (newHotKey.secondModifier && newHotKey.secondModifier !== GlobalHotKeyModifier.None) {
        hotKeyParts.push(newHotKey.secondModifier);
    }

    // Add actual key
    hotKeyParts.push(newHotKey.key);
    globalShortcut.register(hotKeyParts.join("+"), toggleAction);
}

function calculateX(display: Electron.Display): number {
    return Math.round(Number(display.bounds.x + display.bounds.width / 2 - config.appearanceOptions.windowWidth / 2));
}

function calculateY(display: Electron.Display): number {
    return Math.round(
        Number(
            display.bounds.y +
                display.bounds.height / 2 -
                getMaxWindowHeight(
                    config.appearanceOptions.maxSearchResultsPerPage,
                    config.appearanceOptions.searchResultHeight,
                    config.appearanceOptions.userInputHeight,
                    config.appearanceOptions.userInputBottomMargin,
                ) /
                    2,
        ),
    );
}

function onBlur() {
    if (config.generalOptions.hideMainWindowOnBlur) {
        hideMainWindow();
    }
}

function showMainWindow() {
    if (windowExists(mainWindow)) {
        if (mainWindow.isVisible()) {
            mainWindow.focus();
        } else {
            const mousePosition = screen.getCursorScreenPoint();
            const display = config.generalOptions.showAlwaysOnPrimaryDisplay
                ? screen.getPrimaryDisplay()
                : screen.getDisplayNearestPoint(mousePosition);
            const windowBounds: Electron.Rectangle = {
                height: Math.round(
                    Number(config.appearanceOptions.userInputHeight) +
                        Number(config.appearanceOptions.userInputBottomMargin),
                ),
                width: Math.round(Number(config.appearanceOptions.windowWidth)),
                x:
                    config.generalOptions.rememberWindowPosition && lastWindowPosition && lastWindowPosition.x
                        ? lastWindowPosition.x
                        : calculateX(display),
                y:
                    config.generalOptions.rememberWindowPosition && lastWindowPosition && lastWindowPosition.y
                        ? lastWindowPosition.y
                        : calculateY(display),
            };
            // this is a workaround to restore the focus on the previously focussed window
            if (operatingSystem === OperatingSystem.macOS) {
                app.show();
            }
            if (operatingSystem === OperatingSystem.Windows) {
                mainWindow.restore();
            }
            mainWindow.setBounds(windowBounds);
            mainWindow.show();
            mainWindow.focus();
        }
        mainWindow.webContents.send(IpcChannels.mainWindowHasBeenShown);
    }
}

function hideMainWindow() {
    if (windowExists(mainWindow)) {
        mainWindow.webContents.send(IpcChannels.mainWindowHasBeenHidden);

        setTimeout(() => {
            updateMainWindowSize(0, config.appearanceOptions);
            if (windowExists(mainWindow)) {
                // this is a workaround to restore the focus on the previously focussed window
                if (operatingSystem === OperatingSystem.Windows) {
                    mainWindow.minimize();
                }
                mainWindow.hide();

                // this is a workaround to restore the focus on the previously focussed window
                if (operatingSystem === OperatingSystem.macOS) {
                    if (
                        !settingsWindow ||
                        (settingsWindow && settingsWindow.isDestroyed()) ||
                        (settingsWindow && !settingsWindow.isDestroyed() && !settingsWindow.isVisible())
                    ) {
                        app.hide();
                    }
                }
            }
        }, 25);
    }
}

function toggleMainWindow() {
    if (mainWindow.isVisible()) {
        if (mainWindow.isFocused()) {
            hideMainWindow();
        } else {
            showMainWindow();
        }
    } else {
        showMainWindow();
    }
}

function getMaxWindowHeight(
    maxSearchResultsPerPage: number,
    searchResultHeight: number,
    userInputHeight: number,
    userInputBottomMargin: number,
): number {
    return (
        Number(maxSearchResultsPerPage) * Number(searchResultHeight) +
        Number(userInputHeight) +
        Number(userInputBottomMargin)
    );
}

function updateConfig(updatedConfig: UserConfigOptions, needsIndexRefresh?: boolean, pluginType?: PluginType) {
    if (updatedConfig.generalOptions.language !== config.generalOptions.language) {
        onLanguageChange(updatedConfig);
    }

    if (updatedConfig.generalOptions.hotKey !== config.generalOptions.hotKey) {
        registerGlobalKeyboardShortcut(toggleMainWindow, updatedConfig.generalOptions.hotKey);
    }

    if (updatedConfig.generalOptions.rescanIntervalInSeconds !== config.generalOptions.rescanIntervalInSeconds) {
        if (rescanInterval) {
            clearInterval(rescanInterval);
        }
        rescanInterval = setInterval(
            () => refreshAllIndexes(),
            getRescanIntervalInMilliseconds(
                Number(updatedConfig.generalOptions.rescanIntervalInSeconds),
                minimumRefreshIntervalInSeconds,
            ),
        );
    }

    if (!updatedConfig.generalOptions.rescanEnabled) {
        if (rescanInterval) {
            clearInterval(rescanInterval);
        }
    }

    if (Number(updatedConfig.appearanceOptions.windowWidth) !== Number(config.appearanceOptions.windowWidth)) {
        mainWindow.resizable = true;
        mainWindow.setSize(
            Number(updatedConfig.appearanceOptions.windowWidth),
            getMaxWindowHeight(
                updatedConfig.appearanceOptions.maxSearchResultsPerPage,
                updatedConfig.appearanceOptions.searchResultHeight,
                updatedConfig.appearanceOptions.userInputHeight,
                updatedConfig.appearanceOptions.userInputBottomMargin,
            ),
        );
        updateMainWindowSize(0, updatedConfig.appearanceOptions);
        mainWindow.center();
        mainWindow.resizable = false;
    }

    if (JSON.stringify(updatedConfig.appearanceOptions) !== JSON.stringify(config.appearanceOptions)) {
        mainWindow.webContents.send(IpcChannels.appearanceOptionsUpdated, updatedConfig.appearanceOptions);
    }

    if (JSON.stringify(updatedConfig.colorThemeOptions) !== JSON.stringify(config.colorThemeOptions)) {
        if (
            updatedConfig.colorThemeOptions.searchResultsBackgroundColor !==
            config.colorThemeOptions.searchResultsBackgroundColor
        ) {
            mainWindow.setBackgroundColor(getMainWindowBackgroundColor(updatedConfig));
        }
        mainWindow.webContents.send(IpcChannels.colorThemeOptionsUpdated, updatedConfig.colorThemeOptions);
    }

    if (JSON.stringify(updatedConfig.generalOptions) !== JSON.stringify(config.generalOptions)) {
        mainWindow.webContents.send(IpcChannels.generalOptionsUpdated, updatedConfig.generalOptions);
    }

    if (updatedConfig.generalOptions.allowWindowMove !== config.generalOptions.allowWindowMove) {
        mainWindow.setMovable(updatedConfig.generalOptions.allowWindowMove);
    }

    config = updatedConfig;

    updateTrayIcon(updatedConfig);
    updateAutoStartOptions(updatedConfig);

    configRepository
        .saveConfig(updatedConfig)
        .then(() => {
            searchEngine
                .updateConfig(updatedConfig, translationSet)
                .then(() => {
                    if (needsIndexRefresh) {
                        if (pluginType) {
                            refreshIndexOfPlugin(pluginType);
                        } else {
                            refreshAllIndexes();
                        }
                    } else {
                        notifyRenderer(translationSet.successfullyUpdatedconfig, NotificationType.Info);
                    }
                })
                .catch((err) => logger.error(err));
        })
        .catch((err) => logger.error(err));
}

function updateMainWindowSize(searchResultCount: number, appearanceOptions: AppearanceOptions, center?: boolean) {
    if (windowExists(mainWindow)) {
        mainWindow.resizable = true;
        const windowHeight =
            searchResultCount > appearanceOptions.maxSearchResultsPerPage
                ? Math.round(
                      getMaxWindowHeight(
                          appearanceOptions.maxSearchResultsPerPage,
                          appearanceOptions.searchResultHeight,
                          appearanceOptions.userInputHeight,
                          appearanceOptions.userInputBottomMargin,
                      ),
                  )
                : Math.round(
                      Number(searchResultCount) * Number(appearanceOptions.searchResultHeight) +
                          Number(appearanceOptions.userInputHeight) +
                          Number(appearanceOptions.userInputBottomMargin),
                  );

        mainWindow.setSize(Number(appearanceOptions.windowWidth), Number(windowHeight));
        if (center) {
            mainWindow.center();
        }
        mainWindow.resizable = false;
    }
}

function reloadApp() {
    updateMainWindowSize(0, config.appearanceOptions);
    searchEngine = getProductionSearchEngine(operatingSystem, operatingSystemVersion, config, translationSet, logger);
    refreshAllIndexes();
    mainWindow.reload();
}

function beforeQuitApp(): Promise<void> {
    return new Promise((resolve, reject) => {
        destroyTrayIcon();
        if (config.generalOptions.clearCachesOnExit) {
            searchEngine
                .clearCaches()
                .then(() => {
                    logger.debug("Successfully cleared all caches before app quit");
                    resolve();
                })
                .catch((err) => reject(err));
        } else {
            resolve();
        }
    });
}

function quitApp() {
    beforeQuitApp()
        .then(() => {
            /* Do nothing */
        })
        .catch((err) => logger.error(err))
        .finally(() => {
            if (rescanInterval) {
                clearInterval(rescanInterval);
            }
            globalShortcut.unregisterAll();
            app.quit();
        });
}

function updateAutoStartOptions(userConfig: UserConfigOptions) {
    if (!appIsInDevelopment) {
        app.setLoginItemSettings({
            args: [],
            openAtLogin: userConfig.generalOptions.autostart,
            path: process.execPath,
        });
    }
}

function createTrayIcon() {
    if (config.generalOptions.showTrayIcon) {
        trayIcon = new Tray(trayIconFilePath);
        updateTrayIconContextMenu();
    }
}

function updateTrayIconContextMenu() {
    if (trayIcon && !trayIcon.isDestroyed()) {
        trayIcon.setContextMenu(
            Menu.buildFromTemplate([
                {
                    click: showMainWindow,
                    label: translationSet.trayIconShow,
                },
                {
                    click: openSettings,
                    label: translationSet.trayIconSettings,
                },
                {
                    click: refreshAllIndexes,
                    label: translationSet.ueliCommandRefreshIndexes,
                },
                {
                    click: quitApp,
                    label: translationSet.trayIconQuit,
                },
            ]),
        );
    }
}

function updateTrayIcon(updatedConfig: UserConfigOptions) {
    if (updatedConfig.generalOptions.showTrayIcon) {
        if (trayIcon === undefined || (trayIcon && trayIcon.isDestroyed())) {
            createTrayIcon();
        }
    } else {
        destroyTrayIcon();
    }
}

function destroyTrayIcon() {
    if (trayIcon !== undefined && !trayIcon.isDestroyed()) {
        trayIcon.destroy();
    }
}

function onMainWindowMove() {
    if (windowExists(mainWindow)) {
        const currentPosition = mainWindow.getPosition();
        if (currentPosition.length === 2) {
            lastWindowPosition = {
                x: currentPosition[0],
                y: currentPosition[1],
            };

            config.generalOptions.lastWindowPosition = lastWindowPosition;
            updateConfig(config);
        }
    }
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        backgroundColor: getMainWindowBackgroundColor(config),
        center: true,
        frame: false,
        height: getMaxWindowHeight(
            config.appearanceOptions.maxSearchResultsPerPage,
            config.appearanceOptions.searchResultHeight,
            config.appearanceOptions.userInputHeight,
            config.appearanceOptions.userInputBottomMargin,
        ),
        icon: windowIconFilePath,
        maximizable: false,
        minimizable: false,
        movable: config.generalOptions.allowWindowMove,
        resizable: false,
        show: false,
        skipTaskbar: true,
        titleBarStyle: "customButtonsOnHover",
        transparent: mainWindowNeedsToBeTransparent(config),
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        },
        width: config.appearanceOptions.windowWidth,
    });

    mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

    mainWindow.on("blur", onBlur);
    mainWindow.on("closed", quitApp);
    mainWindow.on("moved", onMainWindowMove);
    mainWindow.loadFile(join(__dirname, "..", "main.html"));
}

function mainWindowNeedsToBeTransparent(userConfigOptions: UserConfigOptions): boolean {
    if (operatingSystem === OperatingSystem.macOS) {
        return true;
    }

    return userConfigOptions.appearanceOptions.allowTransparentBackground === true;
}

function getMainWindowBackgroundColor(userConfigOptions: UserConfigOptions): string {
    const transparent = "#00000000";

    if (operatingSystem === OperatingSystem.macOS) {
        return transparent;
    }

    return userConfigOptions.appearanceOptions.allowTransparentBackground === true
        ? transparent
        : toHex(userConfigOptions.colorThemeOptions.searchResultsBackgroundColor, "#FFFFFF");
}

function startApp() {
    createTrayIcon();
    createMainWindow();
    updateMainWindowSize(0, config.appearanceOptions, operatingSystem === OperatingSystem.macOS);
    registerGlobalKeyboardShortcut(toggleMainWindow, config.generalOptions.hotKey);
    updateAutoStartOptions(config);
    setKeyboardShortcuts();
    registerAllIpcListeners();
    refreshAllIndexes();
}

function setKeyboardShortcuts() {
    if (operatingSystem === OperatingSystem.macOS && !appIsInDevelopment) {
        const template = [
            {
                label: "ueli",
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

function onLanguageChange(updatedConfig: UserConfigOptions) {
    translationSet = getTranslationSet(updatedConfig.generalOptions.language);

    if (windowExists(settingsWindow)) {
        settingsWindow.setTitle(translationSet.settings);
    }

    if (windowExists(mainWindow)) {
        mainWindow.webContents.send(IpcChannels.languageUpdated, translationSet);
    }

    updateTrayIconContextMenu();
}

function onSettingsOpen() {
    if (operatingSystem === OperatingSystem.macOS) {
        app.dock.show();
    }
}

function onSettingsClose() {
    if (operatingSystem === OperatingSystem.macOS) {
        app.dock.hide();
    }
}

function openSettings() {
    onSettingsOpen();
    if (!settingsWindow || settingsWindow.isDestroyed()) {
        settingsWindow = new BrowserWindow({
            height: 750,
            icon: windowIconFilePath,
            title: translationSet.settings,
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true,
            },
            width: 1000,
        });
        settingsWindow.setMenu(null);
        settingsWindow.loadFile(join(__dirname, "..", "settings.html"));
        settingsWindow.on("close", onSettingsClose);
        if (appIsInDevelopment) {
            settingsWindow.webContents.openDevTools();
        }
    } else {
        settingsWindow.focus();
    }
}

function updateSearchResults(results: SearchResultItem[], webcontents: WebContents, updatedUserInput?: string) {
    if (updatedUserInput) {
        webcontents.send(IpcChannels.userInputUpdated, updatedUserInput);
    }

    updateMainWindowSize(results.length, config.appearanceOptions);
    webcontents.send(IpcChannels.searchResponse, results);
}

function noSearchResultsFound() {
    if (windowExists(mainWindow)) {
        updateMainWindowSize(1, config.appearanceOptions);
        const noResultFound = getErrorSearchResultItem(
            translationSet.generalErrorTitle,
            translationSet.generalErrorDescription,
        );
        mainWindow.webContents.send(IpcChannels.searchResponse, [noResultFound]);
    }
}

function sendMessageToSettingsWindow(ipcChannel: IpcChannels, message: string) {
    if (windowExists(settingsWindow)) {
        settingsWindow.webContents.send(ipcChannel, message);
    }
}

function windowExists(window: BrowserWindow): boolean {
    return window && !window.isDestroyed();
}

function registerAllIpcListeners() {
    ipcMain.on(
        IpcChannels.configUpdated,
        (
            event: Electron.Event,
            updatedConfig: UserConfigOptions,
            needsIndexRefresh?: boolean,
            pluginType?: PluginType,
        ) => {
            updateConfig(updatedConfig, needsIndexRefresh, pluginType);
        },
    );

    ipcMain.on(IpcChannels.search, (event: Electron.IpcMainEvent, userInput: string) => {
        lastSearchUserInput = userInput;
        searchEngine
            .getSearchResults(userInput)
            .then((result) => {
                if (lastSearchUserInput === userInput) {
                    updateSearchResults(result, event.sender);
                }
            })
            .catch((err) => {
                logger.error(err);
                noSearchResultsFound();
            });
    });

    ipcMain.on(IpcChannels.favoritesRequested, (event: Electron.IpcMainEvent) => {
        searchEngine
            .getFavorites()
            .then((result) => updateSearchResults(result, event.sender))
            .catch((err) => {
                logger.error(err);
                noSearchResultsFound();
            });
    });

    ipcMain.on(IpcChannels.mainWindowHideRequested, () => {
        hideMainWindow();
    });

    ipcMain.on(
        IpcChannels.execute,
        (event, userInput: string, searchResultItem: SearchResultItem, privileged: boolean) => {
            searchEngine
                .execute(searchResultItem, privileged)
                .then(() => {
                    userInputHistoryManager.addItem(userInput);
                    if (
                        searchResultItem.hideMainWindowAfterExecution &&
                        config.generalOptions.hideMainWindowAfterExecution
                    ) {
                        hideMainWindow();
                    } else {
                        updateMainWindowSize(0, config.appearanceOptions);
                    }
                })
                .catch((err) => logger.error(err))
                .finally(() => event.sender.send(IpcChannels.executionFinished));
        },
    );

    ipcMain.on(IpcChannels.openSearchResultLocation, (event: Electron.Event, searchResultItem: SearchResultItem) => {
        searchEngine
            .openLocation(searchResultItem)
            .then(() => hideMainWindow())
            .catch((err) => {
                logger.error(err);
                noSearchResultsFound();
            });
    });

    ipcMain.on(IpcChannels.autoComplete, (event: Electron.IpcMainEvent, searchResultItem: SearchResultItem) => {
        const updatedUserInput = searchEngine.autoComplete(searchResultItem);
        event.sender.send(IpcChannels.autoCompleteResponse, updatedUserInput);
    });

    ipcMain.on(IpcChannels.indexRefreshRequested, () => {
        refreshAllIndexes();
    });

    ipcMain.on(IpcChannels.reloadApp, () => {
        reloadApp();
    });

    ipcMain.on(IpcChannels.openSettingsWindow, () => {
        openSettings();
    });

    ipcMain.on(IpcChannels.folderPathRequested, (event: Electron.IpcMainEvent) => {
        dialog
            .showOpenDialog(settingsWindow, { properties: ["openDirectory"] })
            .then((result) => event.sender.send(IpcChannels.folderPathResult, result.filePaths))
            .catch(() => event.sender.send(IpcChannels.folderPathResult, []));
    });

    ipcMain.on(IpcChannels.filePathRequested, (event: Electron.IpcMainEvent, filters?: Electron.FileFilter[]) => {
        dialog
            .showOpenDialog(settingsWindow, { filters, properties: ["openFile"] })
            .then((result) => event.sender.send(IpcChannels.filePathResult, result.filePaths))
            .catch(() => event.sender.send(IpcChannels.filePathResult, []));
    });

    ipcMain.on(IpcChannels.clearExecutionLogConfirmed, () => {
        searchEngine
            .clearExecutionLog()
            .then(() => notifyRenderer(translationSet.successfullyClearedExecutionLog, NotificationType.Info))
            .catch((err) => {
                logger.error(err);
                notifyRenderer(err, NotificationType.Error);
            });
    });

    ipcMain.on(IpcChannels.openDebugLogRequested, () => {
        logger
            .openLog()
            .then(() => {
                /* do nothing */
            })
            .catch((err) => notifyRenderer(err, NotificationType.Error));
    });

    ipcMain.on(IpcChannels.openTempFolderRequested, () => {
        filePathExecutor(ueliTempFolder, false);
    });

    ipcMain.on(IpcChannels.selectInputHistoryItem, (event: Electron.IpcMainEvent, direction: string) => {
        const newUserInput =
            direction === "next" ? userInputHistoryManager.getNext() : userInputHistoryManager.getPrevious();
        event.sender.send(IpcChannels.userInputUpdated, newUserInput, true);
    });

    ipcMain.on(IpcChannels.ueliCommandExecuted, (command: any) => {
        command = command as UeliCommand;

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
            case UeliCommandExecutionArgument.RefreshIndexes:
                mainWindow.webContents.send(IpcChannels.userInputUpdated, "", false);
                refreshAllIndexes();
                break;
            case UeliCommandExecutionArgument.ClearCaches:
                clearAllCaches();
                break;
            default:
                logger.error("Unhandled ueli command execution");
                break;
        }
    });

    ipcMain.on(IpcChannels.checkForUpdate, () => {
        logger.debug("Check for updates");
        if (appIsInDevelopment) {
            sendMessageToSettingsWindow(IpcChannels.checkForUpdateResponse, UpdateCheckResult.NoUpdateAvailable);
        } else {
            autoUpdater.checkForUpdates();
        }
    });

    ipcMain.on(IpcChannels.downloadUpdate, () => {
        if (operatingSystem === OperatingSystem.Windows) {
            logger.debug("Downloading updated");
            autoUpdater.downloadUpdate();
        } else if (operatingSystem === OperatingSystem.macOS) {
            openUrlInBrowser(releaseUrl)
                .then(() => {
                    /* do nothing */
                })
                .catch((err) => logger.error(err));
        }
    });
}

function addPowershellToPathVariableIfMissing() {
    if (process.env.PATH) {
        if (process.env.PATH.indexOf(windowsPowerShellPath) < 0) {
            process.env.PATH += `;${windowsPowerShellPath}`;
        }
    }
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
app.commandLine.appendSwitch("force-color-profile", "srgb");

autoUpdater.on("update-available", () => {
    logger.debug("Update check result: update available");
    sendMessageToSettingsWindow(IpcChannels.checkForUpdateResponse, UpdateCheckResult.UpdateAvailable);
});

autoUpdater.on("update-not-available", () => {
    logger.debug("Update check result: update not available");
    sendMessageToSettingsWindow(IpcChannels.checkForUpdateResponse, UpdateCheckResult.NoUpdateAvailable);
});

autoUpdater.on("error", (error) => {
    logger.error(`Update check result: ${error}`);
    sendMessageToSettingsWindow(IpcChannels.checkForUpdateResponse, UpdateCheckResult.Error);
});

if (operatingSystem === OperatingSystem.Windows) {
    autoUpdater.on("update-downloaded", () => {
        logger.debug("Update downloaded");
        autoUpdater.quitAndInstall();
    });
}
