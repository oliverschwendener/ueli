import { SearchResultItemViewModel } from "./search-engine";

const Vue = require("vue/dist/vue.min.js")
const os = require("os")
const ipcRenderer = require("electron").ipcRenderer
const delayOnExecution = 50; // in milliseconds

document.addEventListener('keyup', handleGlobalKeyPress);

const vue = new Vue({
    el: '#vue-root',
    data: {
        stylesheetPath: os.platform() === 'win32'
            ? './build/css/windows.css'
            : './build/css/mac.css',
        userInput: '',
        autoFocus: true,
        searchIcon: '',
        searchResults: [] as SearchResultItemViewModel[],
        commandLineOutput: [] as string[]
    },
    methods: {
        handleKeyPress: (event: KeyboardEvent): void => {
            if (event.key === 'Enter') {
                handleEnterPress();
            }
            else if (event.ctrlKey && event.key === 'o') {
                handleOpenFileLocation();
            }
            else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                let direction = event.key === 'ArrowDown' ? 'next' : 'prev';
                changeActiveItem(direction);
            }
            else if (event.key === 'Tab') {
                event.preventDefault();
                handleAutoCompletion();
            }
            else if (event.key === "Escape") {
                ipcRenderer.send('hide-window');
            }
            else if (event.ctrlKey && event.key === 'c') {
                ipcRenderer.send('exit-command-line-tool');
            }
        }
    },
    watch: {
        userInput: (val: string): void => {
            vue.commandLineOutput = [] as string[];
            ipcRenderer.send('get-search', val);
        }
    }
});

ipcRenderer.on('get-search-response', (event: Electron.Event, arg: SearchResultItemViewModel[]): void => {
    updateSearchResults(arg);
});

ipcRenderer.send('get-search-icon');

ipcRenderer.on('get-search-icon-response', (event: Electron.Event, arg: string): void => {
    vue.searchIcon = arg;
});

ipcRenderer.on("auto-complete-response", (event: Electron.Event, arg: string): void => {
    vue.userInput = arg;
});

ipcRenderer.on('command-line-output', (event: Electron.Event, arg: string): void => {
    vue.commandLineOutput.push(arg);
});

function updateSearchResults(searchResults: SearchResultItemViewModel[]): void {
    let idIndex = 0;

    searchResults.forEach((s: SearchResultItemViewModel): void => {
        s.id = `search-result-item-${idIndex}`;
        s.active = false;
        idIndex++;
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

    let next;

    for (let i = 0; i < vue.searchResults.length; i++) {
        if (vue.searchResults[i].active) {
            next = direction === 'next'
                ? i + 1
                : i - 1;
        }
    }

    vue.searchResults.forEach((s: SearchResultItemViewModel) => {
        s.active = false;
    });

    if (next == undefined) return
    if (next < 0) {
        next = vue.searchResults.length - 1;
    }
    else if (next >= vue.searchResults.length) {
        next = 0;
    }

    vue.searchResults[next].active = true;
    scrollIntoView(vue.searchResults[next]);
}

function scrollIntoView(searchResult: SearchResultItemViewModel): void {
    const el = document.getElementById(searchResult.id);
    if (el !== undefined && el !== null) {
        el.scrollIntoView();
    }
}

function handleEnterPress(): void {
    let activeItem = getActiveItem();

    if (activeItem !== undefined) {
        resetUserInput();
        setTimeout(() => {
            if (activeItem !== undefined) {
                execute(activeItem.executionArgument)
            }
        }, delayOnExecution);
    }
}

function handleOpenFileLocation(): void {
    let activeItem = getActiveItem();

    if (activeItem !== undefined) {
        ipcRenderer.send("open-file-location", activeItem.executionArgument);
    }
}

function handleAutoCompletion(): void {
    let activeItem = getActiveItem();

    if (activeItem !== undefined) {
        ipcRenderer.send("auto-complete", [vue.userInput, activeItem.executionArgument]);
    }
}

function getActiveItem(): SearchResultItemViewModel | undefined {
    let activeSearchResults = vue.searchResults.filter((s: any) => {
        return s.active;
    }) as SearchResultItemViewModel[];

    if (activeSearchResults.length > 0) {
        return activeSearchResults[0];
    }
}

function execute(executionArgument: string): void {
    ipcRenderer.send('execute', executionArgument);
}

function resetUserInput(): void {
    vue.userInput = '';
}

function handleGlobalKeyPress(event: KeyboardEvent): void {
    if (event.key === 'F6' || (event.key === 'l' && event.ctrlKey)) {
        focusOnInput();
    }
}

function focusOnInput(): void {
    const userInput = document.getElementById('user-input')
    if (userInput != null) {
        userInput.focus()
    }
}