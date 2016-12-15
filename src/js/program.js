import {ipcRenderer} from 'electron';
import ExecutionService from './js/ExecutionService.js';
import InputValidationService from './js/InputValidationService.js';
import InstalledPrograms from './js/InstalledPrograms';
import InputHistory from './js/InputHistory.js';
import FilePathExecutor from './js/FilePathExecutor.js';

let executionService = new ExecutionService();
let inputValidationService = new InputValidationService();
let installedPrograms = new InstalledPrograms();
let inputHistory = new InputHistory();
let filePathExecutor = new FilePathExecutor();

let userInput = $('input');
let searchResults = $('.search-results');

let programs = [];
let selectIndex = 0;
let maxSelectIndex = 0;

// Program Start
$(document).ready(() => {

});

// User Input Change
userInput.bind('input propertychange', () => {
    searchResults.empty();
    if (userInput.val() === '' || userInput.val() === undefined) {
        programs = [];
        return;
    }

    programs = installedPrograms.getSearchResult(userInput.val());
    showSearchResults();

    if (programs.length > 0)
        selectNextActiveItem('first');
});

userInput.on('keydown', e => {
    if (e.keyCode === 13) {
        let executionArgument;
        if (programs[selectIndex] !== undefined)
            executionArgument = programs[selectIndex].path;
        else
            executionArgument = userInput.val();

        if (executionService.execute(executionArgument)) {
            inputHistory.addItem(userInput.val());
            hideAndResetWindow();
        }
    }

    // Open file location with ctrl+o
    else if (e.ctrlKey && e.keyCode === 79) {
        console.log('key pressed');
        if (programs.length > 0) {
            console.log('programs > 0');
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
    userInput.val(newInputValue);
    userInput.trigger('propertychange');

    if (event !== undefined)
        event.preventDefault();
}

function selectNextActiveItem(param) {
    if (param === 'first')
        selectIndex = 0;

    else if (param === 'next') {
        if (selectIndex < maxSelectIndex)
            selectIndex++;
        else
            selectIndex = 0;
    }

    else if (param === 'prev') {
        if (selectIndex > 0)
            selectIndex = selectIndex - 1;
        else
            selectIndex = maxSelectIndex;

        console.log(selectIndex);
    }

    $('.search-results div').attr('class', '');
    $(`#search-result-${selectIndex}`).attr('class', 'active');
}

function hideAndResetWindow() {
    userInput.val('');
    searchResults.empty();
    ipcRenderer.sendSync('hide-main-window');
}

function showSearchResults() {
    searchResults.empty();

    selectIndex = 0;
    maxSelectIndex = programs.length - 1;

    let inputValidationResult = inputValidationService.getInfoMessage(userInput.val());
    if (inputValidationResult !== undefined) {
        if (programs.length > 0)
            searchResults.html(inputValidationResult);
        else
            searchResults.html(`<div>
                                    <p class="info-message">
                                        ${inputValidationResult}
                                    </p>
                                </div>`);
    }
}

