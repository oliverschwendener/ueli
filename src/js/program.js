import { ipcRenderer } from 'electron';
import ExecutionService from './js/ExecutionService.js';
import InputValidationService from './js/InputValidationService.js';
import InstalledPrograms from './js/InstalledPrograms';
import InputHistory from './js/InputHistory.js';
import FilePathExecutor from './js/FilePathExecutor.js';
import Helpers from './js/Helpers.js';
import ColorThemeManager from './js/ColorThemeManager.js';

// Set color theme
$('#theme').attr('href', `./css/${new ColorThemeManager().getColorTheme()}.css`);

let executionService = new ExecutionService();
let inputValidationService = new InputValidationService();
let installedPrograms = new InstalledPrograms();
let inputHistory = new InputHistory();
let filePathExecutor = new FilePathExecutor();
let helpers = new Helpers();

let input = $('input');
let searchResults = $('.search-results');

let programs = [];
let selectIndex = 0;
let maxSelectIndex = 0;

// Input change
input.bind('input propertychange', () => {
    searchResults.empty();
    if (input.val() === '' || input.val() === undefined || helpers.stringIsEmptyOrWhitespaces(input.val())) {
        programs = [];
        return;
    }

    programs = installedPrograms.getSearchResult(input.val());
    showSearchResults();

    if (programs.length > 0)
        selectNextActiveItem('first');
});

// Keypress
input.on('keydown', e => {
    if (e.keyCode === 13) {
        let executionArgument;
        if (programs[selectIndex] !== undefined)
            executionArgument = programs[selectIndex].path;
        else
            executionArgument = input.val();

        if (executionService.execute(executionArgument)) {
            inputHistory.addItem(input.val());
            hideAndResetWindow();
        }
    }

    // Open file location with ctrl+o
    else if (e.ctrlKey && e.keyCode === 79) {
        if (programs.length > 0) {
            if (filePathExecutor.isValid(programs[selectIndex].path)) {
                filePathExecutor.openFileLocation(programs[selectIndex].path);
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
});

function setNewInputValue(newInputValue, event) {
    input.val(newInputValue);
    input.trigger('propertychange');

    if (event !== undefined)
        event.preventDefault();
}

function selectNextActiveItem(param) {
    selectIndex = helpers.getNextIndex(param, selectIndex, maxSelectIndex);
    $('.search-results div').attr('class', '');
    $(`#search-result-${selectIndex}`).attr('class', 'active');
}

function hideAndResetWindow() {
    input.val('');
    searchResults.empty();
    ipcRenderer.sendSync('hide-main-window');
}

function showSearchResults() {
    searchResults.empty();

    selectIndex = 0;
    maxSelectIndex = programs.length - 1;

    let inputValidationResult = inputValidationService.getInfoMessage(input.val());
    if (inputValidationResult !== undefined) {
        searchResults.html(inputValidationResult);
    }
}