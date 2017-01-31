import { ipcRenderer } from 'electron';
import hljs from 'highlight.js';
import ExecutionService from './js/ExecutionService';
import InputValidationService from './js/InputValidationService';
import InstalledPrograms from './js/InstalledPrograms';
import InputHistory from './js/InputHistory';
import FilePathExecutor from './js/FilePathExecutor';
import Helpers from './js/Helpers';
import ColorThemeManager from './js/Managers/ColorThemeManager';
import WelcomeMessageManager from './js/WelcomeMessageManager';
import PageScroller from './js/PageScroller';
import ItemSelector from './js/ItemSelector';

let executionService = new ExecutionService();
let inputValidationService = new InputValidationService();
let installedPrograms = new InstalledPrograms();
let inputHistory = new InputHistory();
let filePathExecutor = new FilePathExecutor();
let helpers = new Helpers();
let pageScroller = new PageScroller();
let itemSelector = new ItemSelector();

let input = $('#user-input');
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
        hideScrollbar();
        return;
    }

    programs = installedPrograms.getSearchResult(input.val().toLowerCase());
    showSearchResults();
    showScrollbarIfMoreThanFiveSearchResults(programs.length);

    if (programs.length > 0)
        itemSelector.selectNextActiveItem('first');
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
            resetAndHideWindow();
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
        itemSelector.selectNextActiveItem('prev');
        e.preventDefault();
    }
    // Select next item
    else if (e.keyCode === 9) {
        itemSelector.selectNextActiveItem('next');
        e.preventDefault();
    }

    // Hide window when escape is pressed
    else if (e.keyCode === 27) {
        ipcRenderer.send('hide-main-window');
    }
});

$(document).on('keydown', (e) => {
    // F6
    if (e.keyCode === 117)
        input.focus();
});

function resetAndHideWindow() {
    input.val('');
    searchResults.empty();
    hideScrollbar();
    ipcRenderer.send('hide-main-window');
}

function setNewInputValue(newInputValue, event) {
    input.val(newInputValue);
    input.trigger('propertychange');

    if (event !== undefined)
        event.preventDefault();
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

function showScrollbarIfMoreThanFiveSearchResults(searchResultsCount) {
    if(searchResultsCount > 5) showScrollbar();
    else hideScrollbar();
}

function hideScrollbar() {
    searchResults.css('overflow-y', 'hidden');
}

function showScrollbar() {
    searchResults.css('overflow-y', 'scroll');
}