import { SearchResultItemViewModel } from "./search-result-item-view-model";
import { IpcChannels } from "./ipc-channels";
import { ipcRenderer } from "electron";
import { UserConfigFileRepository } from "./user-config/user-config-file-repository";
import { UserInputHistoryManager } from "./user-input-history-manager";
import { ElectronStoreAppConfigRepository } from "./app-config/electorn-store-app-config-repository";
import { availableColorThemes } from "./available-color-themes";
import Vue from "vue";
import { CustomCommand } from "./custom-shortcut";
import { FileSearchOption } from "./file-search-option";
import { Shortcut } from "./shortcut";
import { WebSearch } from "./web-search";
import { version } from "../../package.json";
import { DefaultAppConfigManager } from "./app-config/default-app-config";
import { DefaultUserConfigManager } from "./user-config/default-config";
import { WindowHelpers } from "./helpers/winow-helpers";

const appConfigRepository = new ElectronStoreAppConfigRepository(DefaultAppConfigManager.getDefaultAppConfig());
let config = new UserConfigFileRepository(DefaultUserConfigManager.getDefaultUserConfig(), appConfigRepository.getAppConfig().userSettingsFilePath).getConfig();
let appConfig = appConfigRepository.getAppConfig();

const configEdit = {
    newApplicationFileExtension: "",
    newApplicationFolder: "",
    newCustomCommand: {},
    newFallbackWebSearch: "",
    newFileSearchOption: {},
    newShortcut: {},
    newWebSearch: {},
};

const userInputHistoryManager = new UserInputHistoryManager();

document.addEventListener("keyup", handleGlobalKeyPress);

const vue = new Vue({
    data: {
        appConfig,
        autoFocus: true,
        availableColorThemes,
        commandLineOutput: [] as string[],
        config,
        configEdit,
        downloadingUpdate: false,
        errorOnUpdateCheck: false,
        noUpdateFound: false,
        searchResults: [] as SearchResultItemViewModel[],
        settingsVisible: false,
        updateAvailable: false,
        userInput: "",
        userStylesheet: `file:///${config.userStylesheet}`,
        userStylesheetIsAvailable: config.userStylesheet !== undefined && config.userStylesheet.length > 0,
        version,
    },
    el: "#vue-root",
    methods: {
        colorTheme: (): string => {
            return `./styles/${config.colorTheme}.css`;
        },
        getUnusedFallbackWebSearches: (): WebSearch[] => {
            return config.webSearches.filter((w) => {
                return config.fallbackWebSearches.filter((f) => {
                    return f === w.name;
                }).length === 0;
            });
        },
        handleCheckForUpdateButtonClick: (): void => {
            ipcRenderer.send(IpcChannels.ueliCheckForUpdates);
            vue.downloadingUpdate = true;
        },
        handleClick: (): void => {
            if (config.allowMouseInteraction) {
                handleEnterPress();
                focusOnInput();
            }
        },
        handleCloseSettingsIconClick: (): void => {
            hideSettings();
        },
        handleDownloadUpdateButtonClick: (): void => {
            ipcRenderer.send(IpcChannels.ueliUpdateUeli);
        },
        handleMouseEnter: (index: number): void => {
            if (config.allowMouseInteraction) {
                changeActiveItemByIndex(index);
            }
        },
        handleSettingsIconClick: (): void => {
            toggleSettings();
        },
        handleUserInputKeyPress: (event: KeyboardEvent): void => {
            if (event.key === "Enter") {
                handleEnterPress();
            } else if (event.ctrlKey && event.key === "o") {
                handleOpenFileLocation();
            } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                if (event.shiftKey) {
                    event.preventDefault();
                    const direction = event.key === "ArrowUp" ? "prev" : "next";
                    handleInputHistoryBrowsing(direction);
                } else {
                    const direction = event.key === "ArrowDown" ? "next" : "prev";
                    changeActiveItem(direction);
                }
            } else if (event.key === "Tab") {
                event.preventDefault();
                handleAutoCompletion();
            } else if (event.key === "Escape") {
                ipcRenderer.send(IpcChannels.hideWindow);
            } else if (event.ctrlKey && event.key === "c") {
                ipcRenderer.send(IpcChannels.exitCommandLineTool);
            }
        },
        outputContainerHeight: (): string => {
            return `height: calc(100vh - ${config.userInputHeight}px);`;
        },
        resetAppConfigToDefault: (): void => {
            appConfig = DefaultAppConfigManager.getDefaultAppConfig();
            vue.appConfig = appConfig;
            vue.updateAppConfig();
        },
        resetUserConfigToDefault: (): void => {
            config = DefaultUserConfigManager.getDefaultUserConfig();
            vue.config = config;
            vue.updateUserConfig();
        },
        searchResultDescriptionStyle: (): string => {
            return `font-size: ${config.searchResultDescriptionFontSize}px;`;
        },
        searchResultIconStyle: (): string => {
            return `height: ${config.searchResultHeight}px; width: ${config.searchResultHeight}px;`;
        },
        searchResultNameStyle: (): string => {
            return `font-size: ${config.searchResultNameFontSize}px;`;
        },
        searchResultStyle: (): string => {
            const cursorStyle = config.allowMouseInteraction
                ? "cursor: pointer;"
                : "";

            return `height: ${config.searchResultHeight}px;${cursorStyle}`;
        },
        searchResultWidth: (): string => {
            return `width: ${config.searchResultHeight}px;`;
        },
        settingsActionAddApplicationFileExtension: (newApplicationFileExtension: string): void => {
            config.applicationFileExtensions.push(newApplicationFileExtension);
            vue.updateUserConfig();
            configEdit.newApplicationFileExtension = "";
        },
        settingsActionAddApplicationFolder: (newApplicationFolder: string): void => {
            config.applicationFolders.push(newApplicationFolder);
            vue.updateUserConfig();
            configEdit.newApplicationFolder = "";
        },
        settingsActionAddCustomCommand: (customCommand: CustomCommand): void => {
            config.customCommands.push(customCommand);
            vue.updateUserConfig();
            configEdit.newCustomCommand = {};
        },
        settingsActionAddFallbackWebSearch: (newFallbackWebSearch: string): void => {
            if (newFallbackWebSearch.length > 0) {
                config.fallbackWebSearches.push(newFallbackWebSearch);
                vue.updateUserConfig();
                configEdit.newFallbackWebSearch = "";
            }
        },
        settingsActionAddFileSearchOption: (newFileSearchOption: FileSearchOption): void => {
            config.fileSearchOptions.push(newFileSearchOption);
            vue.updateUserConfig();
            configEdit.newFileSearchOption = {};
        },
        settingsActionAddShortcut: (newShortcut: Shortcut): void => {
            config.shortcuts.push(newShortcut);
            vue.updateUserConfig();
            configEdit.newShortcut = {};
        },
        settingsActionAddWebSearch: (newWebSearch: WebSearch): void => {
            config.webSearches.push(newWebSearch);
            vue.updateUserConfig();
            configEdit.newWebSearch = {};
        },
        settingsActionRemoveApplicationFileExtension: (applicationFileExtension: string): void => {
            const indexToRemove = config.applicationFileExtensions.indexOf(applicationFileExtension);
            config.applicationFileExtensions.splice(indexToRemove, 1);
            vue.updateUserConfig();
        },
        settingsActionRemoveApplicationFolder: (applicationFolder: string): void => {
            const indexToRemove = config.applicationFolders.indexOf(applicationFolder);
            config.applicationFolders.splice(indexToRemove, 1);
            vue.updateUserConfig();
        },
        settingsActionRemoveCustomCommand: (customCommand: CustomCommand): void => {
            const indexToRemove = config.customCommands.indexOf(customCommand);
            config.customCommands.splice(indexToRemove, 1);
            vue.updateUserConfig();
        },
        settingsActionRemoveFallbackWebSearch: (fallbackWebSearch: string): void => {
            const indexToRemove = config.fallbackWebSearches.indexOf(fallbackWebSearch);
            config.fallbackWebSearches.splice(indexToRemove, 1);
            vue.updateUserConfig();
        },
        settingsActionRemoveFileSearchOption: (fileSearchOption: FileSearchOption): void => {
            const indexToRemove = config.fileSearchOptions.indexOf(fileSearchOption);
            config.fileSearchOptions.splice(indexToRemove, 1);
            vue.updateUserConfig();
        },
        settingsActionRemoveShortcut: (shortcut: Shortcut): void => {
            const indexToRemove = config.shortcuts.indexOf(shortcut);
            config.shortcuts.splice(indexToRemove, 1);
            vue.updateUserConfig();
        },
        settingsActionRemoveWebSearch: (webSearch: WebSearch): void => {
            const indexToRemove = config.webSearches.indexOf(webSearch);
            config.webSearches.splice(indexToRemove, 1);
            vue.updateUserConfig();
        },
        settingsActionUpdateIconSet: (): void => {
            vue.updateUserConfig();
        },
        updateAppConfig: (): void => {
            ipcRenderer.send(IpcChannels.updateAppConfig, appConfig);
        },
        updateUserConfig: (): void => {
            ipcRenderer.send(IpcChannels.updateUserConfig, config);
        },
        userInputContainerStyle: (): string => {
            return `height: ${config.userInputHeight}px;`;
        },
        userInputStyle: (): string => {
            return `font-size: ${config.userInputFontSize}px;`;
        },
    },
    watch: {
        userInput: (val: string): void => {
            vue.commandLineOutput = [] as string[];
            handleSearch(val);
        },
    },
});

ipcRenderer.on(IpcChannels.getSearchResponse, (event: Electron.Event, searchResults: SearchResultItemViewModel[]): void => {
    updateSearchResults(searchResults);
});

ipcRenderer.on(IpcChannels.autoCompleteResponse, (event: Electron.Event, arg: string): void => {
    vue.userInput = arg;
});

ipcRenderer.on(IpcChannels.commandLineOutput, (event: Electron.Event, arg: string): void => {
    handleCommandLineOutput(arg);
});

ipcRenderer.on(IpcChannels.ueliUpdateWasFound, () => {
    vue.updateAvailable = true;
    vue.noUpdateFound = false;
    vue.errorOnUpdateCheck = false;
});

ipcRenderer.on(IpcChannels.ueliNoUpdateWasFound, (): void => {
    vue.updateAvailable = false;
    vue.noUpdateFound = true;
    vue.errorOnUpdateCheck = false;
});

ipcRenderer.on(IpcChannels.ueliUpdateCheckError, (): void => {
    vue.updateAvailable = false;
    vue.noUpdateFound = false;
    vue.errorOnUpdateCheck = true;
});

ipcRenderer.on(IpcChannels.resetCommandlineOutput, resetCommandLineOutput);
ipcRenderer.on(IpcChannels.resetUserInput, resetUserInput);
ipcRenderer.on(IpcChannels.hideSettings, hideSettings);
ipcRenderer.on(IpcChannels.showSettingsFromRenderer, showSettings);
ipcRenderer.on(IpcChannels.showSettingsFromMain, showSettings);

function handleSearch(searchTerm: string): void {
    vue.settingsVisible = false;
    ipcRenderer.send(IpcChannels.getSearch, searchTerm);
}

function handleCommandLineOutput(data: string): void {
    vue.settingsVisible = false;
    vue.searchResults = [];
    vue.commandLineOutput.push(data);
}

function handleInputHistoryBrowsing(direction: string): void {
    const newUserInput = direction === "prev"
        ? userInputHistoryManager.getPrevious()
        : userInputHistoryManager.getNext();

    vue.userInput = newUserInput;
}

function updateSearchResults(searchResults: SearchResultItemViewModel[]): void {
    let index = 0;

    searchResults.forEach((searchResultItem: SearchResultItemViewModel): void => {
        searchResultItem.id = `search-result-item-${index}`;
        searchResultItem.active = false;
        index++;
    });

    if (searchResults.length > 0) {
        searchResults[0].active = true;
    }

    vue.searchResults = searchResults;

    if (vue.searchResults.length > 0) {
        scrollIntoView(vue.searchResults[0]);
    }
}

function changeActiveItem(direction: string): void {
    if (vue.searchResults.length === 0) {
        return;
    }

    let nextIndex;

    for (let i = 0; i < vue.searchResults.length; i++) {
        if (vue.searchResults[i].active) {
            nextIndex = direction === "next"
                ? i + 1
                : i - 1;
        }
    }

    if (nextIndex === undefined) {
        return;
    }

    if (nextIndex < 0) {
        nextIndex = vue.searchResults.length - 1;
    } else if (nextIndex >= vue.searchResults.length) {
        nextIndex = 0;
    }

    changeActiveItemByIndex(nextIndex);
    scrollIntoView(vue.searchResults[nextIndex]);
}

function changeActiveItemByIndex(index: number): void {
    vue.searchResults.forEach((searchResultItem: SearchResultItemViewModel) => {
        searchResultItem.active = false;
    });

    vue.searchResults[index].active = true;
}

function scrollIntoView(searchResult: SearchResultItemViewModel): void {
    const htmlElement = document.getElementById(searchResult.id);
    if (htmlElement !== undefined && htmlElement !== null) {
        const outputContainer = document.getElementById("output-container");
        if (outputContainer !== undefined && outputContainer !== null) {
            const outputContainerMaxHeight = WindowHelpers.calculateWindowHeight(vue.searchResults.length, config.maxSearchResultCount, config.userInputHeight, config.searchResultHeight);
            const elementIsOutOfViewBottom = (htmlElement.offsetTop > (outputContainer.scrollTop + outputContainerMaxHeight - config.searchResultHeight));
            const elementIsOutOfViewTop = htmlElement.offsetTop - config.userInputHeight < outputContainer.scrollTop;

            if (elementIsOutOfViewBottom) {
                const scrollTo = htmlElement.offsetTop - config.userInputHeight ;

                outputContainer.scrollTo({ top: scrollTo, behavior: config.smoothScrolling ? "smooth" : "instant" });
            } else if (elementIsOutOfViewTop) {
                let scrollTo = htmlElement.offsetTop - outputContainer.clientHeight - 20; // I have no idea why 20
                if (scrollTo < 0) {
                    scrollTo = 0;
                }

                outputContainer.scrollTo({ top: scrollTo, behavior: config.smoothScrolling ? "smooth" : "instant" });
            }
        }
    }
}

function handleEnterPress(): void {
    const activeItem = getActiveItem();

    if (activeItem !== undefined) {
        execute(activeItem.executionArgument, vue.userInput);
    }
}

function handleOpenFileLocation(): void {
    const activeItem = getActiveItem();

    if (activeItem !== undefined) {
        ipcRenderer.send(IpcChannels.openFileLocation, activeItem.executionArgument);
    }
}

function handleAutoCompletion(): void {
    const activeItem = getActiveItem();

    if (activeItem !== undefined) {
        ipcRenderer.send(IpcChannels.autoComplete, activeItem.executionArgument);
    }
}

function getActiveItem(): SearchResultItemViewModel | undefined {
    const activeSearchResults = vue.searchResults.filter((s: any) => {
        return s.active;
    }) as SearchResultItemViewModel[];

    if (activeSearchResults.length > 0) {
        return activeSearchResults[0];
    }
}

function execute(executionArgument: string, userInput: string): void {
    userInputHistoryManager.addItem(userInput);
    ipcRenderer.send(IpcChannels.execute, executionArgument);
}

function resetUserInput(): void {
    vue.userInput = "";
}

function handleGlobalKeyPress(event: KeyboardEvent): void {
    if (event.key === "F6" || (event.key === "l" && event.ctrlKey)) {
        focusOnInput();
    } else if (event.key === "i" && event.ctrlKey) {
        toggleSettings();
    }
}

function focusOnInput(): void {
    const userInput = document.getElementById("user-input");
    if (userInput != null) {
        userInput.focus();
    }
}

function resetCommandLineOutput(): void {
    vue.commandLineOutput = [];
}

function toggleSettings(): void {
    if (vue.settingsVisible) {
        hideSettings();
    } else {
        showSettings();
    }
}

function hideSettings(): void {
    focusOnInput();
    ipcRenderer.send(IpcChannels.hideSettings);
    vue.settingsVisible = false;
}

function showSettings(): void {
    vue.searchResults = [];
    resetCommandLineOutput();
    ipcRenderer.send(IpcChannels.showSettingsFromRenderer);
    vue.settingsVisible = true;
}
