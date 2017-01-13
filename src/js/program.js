import { ipcRenderer } from 'electron';
import hljs from 'highlight.js';
import ExecutionService from './js/ExecutionService.js';
import InputValidationService from './js/InputValidationService.js';
import InstalledPrograms from './js/InstalledPrograms';
import InputHistory from './js/InputHistory.js';
import FilePathExecutor from './js/FilePathExecutor.js';
import Helpers from './js/Helpers.js';
import ColorThemeManager from './js/ColorThemeManager.js';
import WelcomeMessageManager from './js/WelcomeMessageManager.js';

let executionService = new ExecutionService();
let inputValidationService = new InputValidationService();
let installedPrograms = new InstalledPrograms();
let inputHistory = new InputHistory();
let filePathExecutor = new FilePathExecutor();
let helpers = new Helpers();

let input = $('input');
let searchResults = $('.search-results');
let searchIcon = $('#search-icon');

let programs = [];
let selectIndex = 0;
let maxSelectIndex = 0;

// Initalize highlight.js
hljs.initHighlightingOnLoad();

// Set color theme
$('#theme').attr('href', `./css/${new ColorThemeManager().getColorTheme()}.css`);
$('#highlight-theme').attr('href', `./node_modules/highlight.js/styles/${new ColorThemeManager().getHighlightColorTheme()}.css`);

// Set welcome message
input.attr('placeholder', new WelcomeMessageManager().getMessage());

// Input change
input.bind('input propertychange', () => {
    searchResults.empty();
    showIcon();

    if (input.val() === '' || input.val() === undefined || helpers.stringIsEmptyOrWhitespaces(input.val())) {
        programs = [];
        return;
    }

    programs = installedPrograms.getSearchResult(input.val().toLowerCase());
    showSearchResults();

    if (programs.length > 0)
        selectNextActiveItem('first');
});

// Keypress
input.on('keydown', e => {
    // When user hits enter
    if (e.keyCode === 13) {
        let executionArgument;
        if (programs[selectIndex] !== undefined)
            executionArgument = programs[selectIndex].path;
        else
            executionArgument = input.val().toLowerCase();

        if (executionService.execute(executionArgument)) {
            inputHistory.addItem(input.val());
            hideAndResetWindow();
        }
    }

    // Open file location with ctrl+o
    else if (e.ctrlKey && e.keyCode === 79) {
        if (programs.length > 0) {
            if (filePathExecutor.isValid(programs[selectIndex].path.toLowerCase())) {
                filePathExecutor.openFileLocation(programs[selectIndex].path.toLowerCase());
            }
        }
    }

    // Browse input history
    else if (e.keyCode === 38) {
        setNewInputValue(inputHistory.getPrevious(), e);
    }
    else if (e.keyCode === 40) {
        setNewInputValue(inputHistory.getNext(), e);
    }

    // Select previous item
    else if (e.shiftKey && e.keyCode === 9) {
        selectNextActiveItem('prev');
        e.preventDefault();
    }
    // Select next item
    else if (e.keyCode === 9) {
        selectNextActiveItem('next');
        e.preventDefault();
    }

    // Hide window when escape is pressed
    else if (e.keyCode === 27) {
        ipcRenderer.sendSync('hide-main-window');
    }
});

$(document).on('keydown', (e) => {
    // F6
    if(e.keyCode === 117)
        input.focus();
});

function setNewInputValue(newInputValue, event) {
    input.val(newInputValue);
    input.trigger('propertychange');

    if (event !== undefined)
        event.preventDefault();
}

function selectNextActiveItem(direction) {
    if (programs.length === 0)
        return;

    selectIndex = helpers.getNextIndex(direction, selectIndex, maxSelectIndex);
    $('.search-results div').attr('class', '');
    $(`#search-result-${selectIndex}`).attr('class', 'active');

    scrollToId(selectIndex, direction, programs.length - 1);
}

function hideAndResetWindow() {
    input.val('');
    searchResults.empty();
    ipcRenderer.sendSync('hide-main-window');
}

function showIcon() {
    let icon = inputValidationService.getIcon(input.val().toLowerCase());
    searchIcon.attr('class', icon);
}

function showSearchResults() {
    searchResults.empty();

    selectIndex = 0;
    maxSelectIndex = programs.length - 1;

    let inputValidationResult = inputValidationService.getInfoMessage(input.val().toLowerCase());
    if (inputValidationResult !== undefined) {
        searchResults.html(inputValidationResult);

        $("pre code").each(function (i, e) {
            hljs.highlightBlock(e);
        });
    }
}

function scrollToId(id, direction, max) {
    let idToScroll;

    if (id === max)
        idToScroll = id;
    else if (id === 0)
        idToScroll = id;
    else {
        if (direction === 'next' && id % 5 === 0 && id >= 5)
            idToScroll = id;
        else if ((direction === 'prev') && ((id + 1) % 5 === 0) && (id >= 4))
            idToScroll = id - 4;
        else if (direction === 'next' && id === 0)
            idToScroll = id;
    }

    if (idToScroll !== undefined) {
        let selectorId = `search-result-${idToScroll}`;
        let offset = document.getElementById(selectorId).offsetTop;
        $('.search-results').animate({ scrollTop: offset }, 'fast');
    }
}