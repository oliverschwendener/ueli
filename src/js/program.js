import { ipcRenderer } from 'electron';
import ExecutionService from './js/ExecutionService.js';
import InstalledPrograms from './js/InstalledPrograms';

let executionService = new ExecutionService();
let installedPrograms = new InstalledPrograms();

let userInput = $('input');

let programs = [];
let selectIndex = 0;
let maxSelectIndex = 0;

// Program Start
$(document).ready(() => {

});

// User Input Change
userInput.bind('input propertychange', () => {
    $('.search-results').empty();
    if(userInput.val() === '' || userInput.val() === undefined) {
        programs = [];
        return;
    }

    programs = installedPrograms.getSearchResult(userInput.val());

    if(programs.length > 0) {
        selectIndex = 0;
        maxSelectIndex = programs.length - 1;

        for(let program of programs)
            $('.search-results').append(`<div id="search-result-${program.number}">
                <p class="app-name">${program.name} <span>#${program.number}</span></p>
                <p class="app-path">${program.path}</p>
            </div>`);
        selectItem('first');
    }

    else
        $('.search-results').html('<div><p class="nothing-found-message">Nothing found</p></div>');
});

userInput.on('keydown', e => {
    if (e.keyCode === 13) {
        let executionArgument;
        if(programs[selectIndex] !== undefined)
            executionArgument = programs[selectIndex].path;
        else
            executionArgument = userInput.val();

        executionService.execute(executionArgument);
    }

    else if(e.shiftKey && e.keyCode === 9) {
        selectItem('prev');
        e.preventDefault();
    }

    // Select Next
    else if(e.keyCode === 9) {
        selectItem('next');
        e.preventDefault();
    }
});

function selectItem(param) {
    if(param === 'first')
        selectIndex = 0;

    else if(param === 'next') {
        if(selectIndex < maxSelectIndex)
            selectIndex++;
        else
            selectIndex = 0;
    }

    else if(param === 'prev') {
        if(selectIndex > 0)
            selectIndex = selectIndex - 1;
        else
            selectIndex = maxSelectIndex;

        console.log(selectIndex);
    }

    $('.search-results div').attr('class', '');
    $(`#search-result-${selectIndex}`).attr('class', 'active');
}

