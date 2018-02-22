const Vue = require("vue/dist/vue.min.js")
const os = require("os")
const ipcRenderer = require("electron").ipcRenderer
const delayOnExecution = 50; // in milliseconds

document.addEventListener('keyup', handleGlobalKeyPress);

const vue = new Vue({
    el: '#vue-root',
    data: {
        stylesheetPath: os.platform() === 'win32' ? __dirname + '/build/styles/css/windows.css' : __dirname + '/build/styles/css/mac.css',
        userInput: '',
        autoFocus: true,
        searchIcon: '',
        searchResults: Array<any>(),
        commandLineOutput: Array<any>()
    },
    methods: {
        handleKeyPress: (event: KeyboardEvent) => {
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
        userInput: (val:any) => {
            vue.commandLineOutput = [];
            ipcRenderer.send('get-search', val);
        }
    }
});

ipcRenderer.on('get-search-response', (event: Electron.Event, arg: any) => {
    updateSearchResults(arg);
});

ipcRenderer.send('get-search-icon');

ipcRenderer.on('get-search-icon-response', (event: Electron.Event, arg: any) => {
    vue.searchIcon = arg;
});

ipcRenderer.on("auto-complete-response", (event: Electron.Event, arg: any) => {
    vue.userInput = arg;
});

ipcRenderer.on('command-line-output', (event: Electron.Event, arg: any) => {
    vue.commandLineOutput.push(arg);
});

function updateSearchResults(searchResults: any) {
    let idIndex = 0;

    searchResults.forEach((s: any) => {
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

function changeActiveItem(direction: any) {
    if (vue.searchResults.length === 0) {
        return;
    }

    let next;

    for (let i = 0; i < vue.searchResults.length; i++) {
        if (vue.searchResults[i].active) {
            next = direction === 'next' ? i + 1 : i - 1;
        }
    }

    vue.searchResults.forEach((s:any) => {
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

function scrollIntoView(searchResult: any) {
    const el = document.getElementById(searchResult.id);
    if (el !== undefined && el !== null) {
        el.scrollIntoView();
    }
}

function handleEnterPress() {
    let activeItem = getActiveItem();

    if (activeItem !== undefined) {
        resetUserInput();
        setTimeout(() => {
            execute(activeItem.executionArgument)
        }, delayOnExecution);
    }
}

function handleOpenFileLocation() {
    let activeItem = getActiveItem();

    if (activeItem !== undefined) {
        ipcRenderer.send("open-file-location", activeItem.executionArgument);
    }
}

function handleAutoCompletion() {
    let activeItem = getActiveItem();

    if (activeItem !== undefined) {
        ipcRenderer.send("auto-complete", [vue.userInput, activeItem.executionArgument]);
    }
}

function getActiveItem() {
    let activeSearchResults = vue.searchResults.filter((s: any) => {
        return s.active;
    });

    if (activeSearchResults.length > 0) {
        return activeSearchResults[0];
    }
}

function execute(executionArgument: any) {
    ipcRenderer.send('execute', executionArgument);
}

function resetUserInput() {
    vue.userInput = '';
}

function handleGlobalKeyPress(event: any) {
    if (event.key === 'F6' || (event.key === 'l' && event.ctrlKey)) {
        focusOnInput();
    }
}

function focusOnInput() {
    const userInput = document.getElementById('user-input')
    if (userInput != null) {
        userInput.focus()
    }
}