import { SearchResultItemViewModel } from "./search-result-item-view-model";
import { IpcChannels } from "./ipc-channels";
import { platform } from "os";
import { ipcRenderer } from "electron";
import * as macStyles from "../scss/mac.scss";
import * as windowsStyles from "../scss/windows.scss";

// tslint:disable-next-line:no-var-requires because vue won't work otherwise
const Vue = require("vue/dist/vue.min.js");

const delayOnExecution = 50; // in milliseconds

document.addEventListener("keyup", handleGlobalKeyPress);

const vue = new Vue({
    data: {
        autoFocus: true,
        commandLineOutput: [] as string[],
        searchIcon: "",
        searchResults: [] as SearchResultItemViewModel[],
        stylesheetPath: platform() === "win32"
            ? "./build/" + windowsStyles
            : "./build/" + macStyles,
        userInput: "",
    },
    el: "#vue-root",
    methods: {
        handleKeyPress: (event: KeyboardEvent): void => {
            if (event.key === "Enter") {
                handleEnterPress();
            } else if (event.ctrlKey && event.key === "o") {
                handleOpenFileLocation();
            } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                const direction = event.key === "ArrowDown" ? "next" : "prev";
                changeActiveItem(direction);
            } else if (event.key === "Tab") {
                event.preventDefault();
                handleAutoCompletion();
            } else if (event.key === "Escape") {
                ipcRenderer.send(IpcChannels.hideWindow);
            } else if (event.ctrlKey && event.key === "c") {
                ipcRenderer.send(IpcChannels.exitCommandLineTool);
            }
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

ipcRenderer.send(IpcChannels.getSearchIcon);

ipcRenderer.on(IpcChannels.getSearchIconResponse, (event: Electron.Event, arg: string): void => {
    vue.searchIcon = arg;
});

ipcRenderer.on(IpcChannels.autoCompleteResponse, (event: Electron.Event, arg: string): void => {
    vue.userInput = arg;
});

ipcRenderer.on(IpcChannels.commandLineOutput, (event: Electron.Event, arg: string): void => {
    vue.commandLineOutput.push(arg);
});

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

    vue.searchResults.forEach((searchResultItem: SearchResultItemViewModel) => {
        searchResultItem.active = false;
    });

    if (nextIndex === undefined) {
        return;
    }

    if (nextIndex < 0) {
        nextIndex = vue.searchResults.length - 1;
    } else if (nextIndex >= vue.searchResults.length) {
        nextIndex = 0;
    }

    vue.searchResults[nextIndex].active = true;
    scrollIntoView(vue.searchResults[nextIndex]);
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
        resetUserInput();
        setTimeout(() => {
            if (activeItem !== undefined) {
                execute(activeItem.executionArgument);
            }
        }, delayOnExecution);
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
        ipcRenderer.send(IpcChannels.autoComplete, [vue.userInput, activeItem.executionArgument]);
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

function execute(executionArgument: string): void {
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
