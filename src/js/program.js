import {ipcRenderer} from 'electron';
import ExecutionService from './js/ExecutionService.js';
import InstalledPrograms from './js/InstalledPrograms';
import InputHistory from './js/InputHistory.js';

let executionService = new ExecutionService();
let installedPrograms = new InstalledPrograms();
let inputHistory = new InputHistory();

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
    $('.search-results').empty();
    if (userInput.val() === '' || userInput.val() === undefined) {
        programs = [];
        return;
    }

    programs = installedPrograms.getSearchResult(userInput.val());

    if (programs.length > 0) {
        selectIndex = 0;
        maxSelectIndex = programs.length - 1;

        for (let program of programs)
            searchResults
                .append(`<div id="search-result-${program.number}">
                            <p class="app-name">${program.name}</p>
                            <p class="app-path">${program.path}</p>
                        </div>`);

        selectNextActiveItem('first');
    }

    else
        searchResults
            .html(`<div>
                        <p class="nothing-found-message">
                            Nothing found
                        </p>
                    </div>`);
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

    // Browse Inputhistory
    else if (e.keyCode === 38) {
        userInput.val(inputHistory.getPrevious());
        userInput.trigger('propertychange');
    }
    else if (e.keyCode === 40) {
        if (inputHistory.index < inputHistory.history.length) {
            userInput.val(inputHistory.getNext());
            userInput.trigger('propertychange');
        }
    }

    // Select Previous Item
    else if (e.shiftKey && e.keyCode === 9) {
        selectNextActiveItem('prev');
        e.preventDefault();
    }

    // Select Next Item
    else if (e.keyCode === 9) {
        selectNextActiveItem('next');
        e.preventDefault();
    }
});

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

