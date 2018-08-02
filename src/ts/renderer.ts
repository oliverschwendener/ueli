import { SearchResultItemViewModel } from "./search-result-item-view-model";
import { IpcChannels } from "./ipc-channels";
import { platform } from "os";
import { ipcRenderer } from "electron";
import Vue from "vue";
import { ConfigFileRepository } from "./config-file-repository";
import { UeliHelpers } from "./helpers/ueli-helpers";
import { defaultConfig } from "./default-config";
import { UserInputHistoryManager } from "./user-input-history-manager";
import { Injector } from "./injector";

const config = new ConfigFileRepository(defaultConfig, UeliHelpers.configFilePath).getConfig();
const userInputHistoryManager = new UserInputHistoryManager();
const iconSet = Injector.getIconSet(platform());

document.addEventListener("keyup", handleGlobalKeyPress);

const vue = new Vue({
    data: {
        autoFocus: true,
        commandLineOutput: [] as string[],
        searchIcon: iconSet.searchIcon,
        searchResults: [] as SearchResultItemViewModel[],
        stylesheetPath: `./styles/${config.colorTheme}.css`,
        userInput: "",
    },
    el: "#vue-root",
    methods: {
        handleClick: (): void => {
            if (config.allowMouseInteraction) {
                handleEnterPress();
                focusOnInput();
            }
        },
        handleKeyPress: (event: KeyboardEvent): void => {
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
            } else if (event.key === "F1") {
                ipcRenderer.send(IpcChannels.showHelp);
            }
        },
        handleMouseEnter: (index: number): void => {
            if (config.allowMouseInteraction) {
                changeActiveItemByIndex(index);
            }
        },
        outputContainerHeight: (): string => {
            return `height: calc(100vh - ${config.userInputHeight}px);`;
        },
        searchResultExecutionArgumentStyle: (): string => {
            return `font-size: ${config.searchResultExecutionArgumentFontSize}px;`;
        },
        searchResultHeight: (): string => {
            return `height: ${config.searchResultHeight}px`;
        },
        searchResultIconStyle: (): string => {
            return `height: ${config.searchResultHeight}px; width: ${config.searchResultHeight}px;`;
        },
        searchResultNameStyle: (): string => {
            return `font-size: ${config.searchResultNameFontSize}px;`;
        },
        searchResultWidth: (): string => {
            return `width: ${config.searchResultHeight}px;`;
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
            ipcRenderer.send(IpcChannels.getSearch, val);
        },
    },
});

ipcRenderer.on(IpcChannels.getSearchResponse, (event: Electron.Event, arg: SearchResultItemViewModel[]): void => {
    updateSearchResults(arg);
});

ipcRenderer.on(IpcChannels.autoCompleteResponse, (event: Electron.Event, arg: string): void => {
    vue.userInput = arg;
});

ipcRenderer.on(IpcChannels.commandLineOutput, (event: Electron.Event, arg: string): void => {
    vue.commandLineOutput.push(arg);
});

ipcRenderer.on(IpcChannels.resetCommandlineOutput, resetCommandLineOutput);
ipcRenderer.on(IpcChannels.resetUserInput, resetUserInput);

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
        htmlElement.scrollIntoView();
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
