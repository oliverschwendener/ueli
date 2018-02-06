let ipcRenderer = require('electron').ipcRenderer;
let delayOnExecution = 50; // in milliseconds

let vue = new Vue({
    el: '#vue-root',
    data: {
        userInput: '',
        searchResults: [],
        autoFocus: true
    },
    methods: {
        handleKeyUp: (event) => {
            if (event.key === 'Enter') {
                handleEnterPress();
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
    let searchResults = arg;

    if (searchResults.length > 0) {
        searchResults[0].active = true;
    }

    vue.searchResults = searchResults;
});

function handleEnterPress() {
    let activeSearchResults = vue.searchResults.filter((s) => {
        return s.active;
    });

    if (activeSearchResults.length > 0) {
        resetUserInput();
        setTimeout(() => {
            execute(activeSearchResults[0].executionArgument)
        }, delayOnExecution);
    }
}

function execute(executionArgument) {
    ipcRenderer.send('execute', executionArgument);
}

function resetUserInput() {
    vue.userInput = '';
}