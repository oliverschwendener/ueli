let os = require('os');
let ipcRenderer = require('electron').ipcRenderer;
let delayOnExecution = 50; // in milliseconds

let vue = new Vue({
    el: '#vue-root',
    data: {
        userInput: '',
        searchResults: [],
        autoFocus: true,
        stylesheetPath: os.platform() === 'win32' ? './styles/css/windows.css' : './styles/css/mac.css'
    },
    methods: {
        handleKeyPress: (event) => {
            if (event.key === 'Enter') {
                handleEnterPress();
            }
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                let direction = event.key === 'ArrowDown' ? 'next' : 'prev';
                handleChangeActive(direction);
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
});

function handleChangeActive(direction) {
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

    if (!isElementInViewport(vue.searchResults[next])) {
        scrollIntoView(vue.searchResults[next]);
    }
}

function scrollIntoView(searchResult) {
    el = document.getElementById(searchResult.id);
    el.scrollIntoView();
}

function isElementInViewport(searchResult) {
    el = document.getElementById(searchResult.id);
    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

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