let ipcRenderer = require('electron').ipcRenderer;

let vue = new Vue({
    el: '#vue-root',
    data: {
        userInput: '',
        searchResults: [],
        autoFocus: true
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