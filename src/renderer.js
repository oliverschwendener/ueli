let os = require('os');
let ipcRenderer = require('electron').ipcRenderer;
let delayOnExecution = 50; // in milliseconds

document.addEventListener('keyup', handleGlobalKeyPress);

let vue = new Vue({
    el: '#vue-root',
    data: {
        userInput: '',
        searchResults: [],
        autoFocus: true,
        stylesheetPath: os.platform() === 'win32' ? './styles/css/windows.css' : './styles/css/mac.css',
        searchIcon: ''
    },
    methods: {
        handleKeyPress: (event) => {
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
        }
    },
    watch: {
        userInput: (val) => {
            ipcRenderer.send('get-search', val);
        }
    }
});

ipcRenderer.on('get-search-response', (event, arg) => {
    updateSearchResults(arg);
});

ipcRenderer.send('get-search-icon');

ipcRenderer.on('get-search-icon-response', (event, arg) => {
    vue.searchIcon = arg;
});

ipcRenderer.on("auto-complete-response", (event, arg) => {
    vue.userInput = arg;
});

function updateSearchResults(searchResults) {
    let idIndex = 0;

    searchResults.forEach((s) => {
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

function changeActiveItem(direction) {
    if (vue.searchResults.length === 0) {
        return;
    }

    let next;

    for (let i = 0; i < vue.searchResults.length; i++) {
        if (vue.searchResults[i].active) {
            next = direction === 'next' ? i + 1 : i - 1;
        }
    }

    vue.searchResults.forEach((s) => {
        s.active = false;
    });

    if (next < 0) {
        next = vue.searchResults.length - 1;
    }
    else if (next >= vue.searchResults.length) {
        next = 0;
    }

    vue.searchResults[next].active = true;
    scrollIntoView(vue.searchResults[next]);
}

function scrollIntoView(searchResult) {
    el = document.getElementById(searchResult.id);
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
    let activeSearchResults = vue.searchResults.filter((s) => {
        return s.active;
    });

    if (activeSearchResults.length > 0) {
        return activeSearchResults[0];
    }
}

function execute(executionArgument) {
    ipcRenderer.send('execute', executionArgument);
}

function resetUserInput() {
    vue.userInput = '';
}

function handleGlobalKeyPress(event) {
    if (event.key === 'F6' || (event.key === 'l' && event.ctrlKey)) {
        focusOnInput();
    }
}

function focusOnInput() {
    document.getElementById('user-input').focus();
}