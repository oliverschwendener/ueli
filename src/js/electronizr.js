import os from 'os';
import path from 'path';
import { exec } from 'child_process';
import open from 'open';
import levenshtein from 'fast-levenshtein';
import { ipcRenderer } from 'electron';
import SearchService from './js/SearchService';

let searchService = new SearchService();
let selector = {
    content: '.content',
    input: 'input',
    value: '.result-value',
    path: '.result-path',
};

let shortCutFileExtension = '.lnk';
let startMenuFolders = [
    os.homedir() + '\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu',
    'C:\\ProgramData\\Microsoft\\Windows\\Start Menu'
];

let fileWatcher = searchService.initializeFileWatcher(startMenuFolders);

let shortCutFiles = searchService.getFilesFromDirectoriesRecursively(startMenuFolders, shortCutFileExtension);

let searchResult = [];
let searchResultIndex = 0;

let animationSpeed = 500;
let maxResultItems = 10;



function DisplaySearchResult() {
    if (searchResult === undefined || searchResult.length === 0)
        return;

    if (searchResultIndex < 0)
        searchResultIndex = searchResult.length - 1;
    if (searchResultIndex > searchResult.length - 1)
        searchResultIndex = 0;

    $(selector.value).empty();
    $(selector.value).children('p').removeClass('active');

    for (let i = 0; i < searchResult.length; i++) {
        $(selector.value).append('<p id="' + i + '">' + searchResult[i].Name + '</p>');
        $(selector.value).find('#' + searchResultIndex).addClass('active');
        $(selector.path).html(searchResult[searchResultIndex].Path);
    }

    $(selector.path).html(searchResult[searchResultIndex].Path);
    ResizeWindow();
}

function GetSearchResult(value) {
    if (value === '') return;

    let allShortCuts = shortCutFiles;
    let apps = [];

    for (let i = 0; i < allShortCuts.length; i++) {
        let displayName = path.basename(allShortCuts[i]).replace(shortCutFileExtension, '');
        let fileName = path.basename(allShortCuts[i]).toLowerCase().replace(shortCutFileExtension, '');
        let weight = GetWeight(fileName, value.toLowerCase());

        if (!StringContainsSubstring(fileName, value)) continue;
        if (SearchResultListContainsValue(apps, displayName)) continue;

        apps.push({
            Name: displayName,
            Path: '"" "' + allShortCuts[i] + '"',
            Weight: weight
        });
    }

    let sortedResult = apps.sort((a, b) => {
        if (a.Weight > b.Weight) return 1;
        if (a.Weight < b.Weight) return -1;
        return 0;
    });

    if (sortedResult.length > maxResultItems) {
        let newResult = [];
        for (let i = 0; i < maxResultItems; i++) {
            if (i == maxResultItems)
                break;
            newResult.push(sortedResult[i]);
        }
        return newResult;
    }

    return sortedResult;
}

function HandleUrlInput(url) {
    if (!url.startsWith('http://') || !url.startsWith('https://'))
        url = 'http://' + url;

    open(url, error => {
        if (error) throw error;
    });

    HideMainWindow();
}

function HandleElectronizrCommand(command) {
    switch (command) {
        case 'exit':
            ipcRenderer.sendSync('close-main-window');
            break;

        case 'reload':
            UpdateAppList();
            break;

        default:
            return;
    }

    HideMainWindow();
}

function HandleWindowsPathInput(path) {
    let command = '"" "' + path + '"';
    StartProcess(command)
}

function StartProcess(pathToLnk) {
    if (pathToLnk === '') return;

    let cmd = exec('start ' + pathToLnk, (error, stdout, stderr) => {
        if (error)
            throw error;
    });

    HideMainWindow();
}

function HideMainWindow() {
    ResetGui();
    ipcRenderer.sendSync('hide-main-window');
}

function ResetGui() {
    $(selector.input).val('');
    $(selector.value).empty();
    $(selector.path).empty();
}

function GetWeight(stringToSearch, value) {
    let result = [];
    let stringToSearchWords = SplitStringToArray(stringToSearch);
    let valueWords = SplitStringToArray(value);

    for (let i = 0; i < stringToSearchWords.length; i++)
        for (let j = 0; j < valueWords.length; j++)
            result.push(levenshtein.get(stringToSearchWords[i], valueWords[j]));

    return GetAvg(result);
}

function GetAvg(array) {
    let sum = 0;

    for (let i = 0; i < array.length; i++)
        sum = sum + array[i];

    return sum / array.length;
}

function SplitStringToArray(string) {
    return string.split(/\s+/);
}

function IsValidUrl(url) {

    let expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    let regex = new RegExp(expression);

    if (url.match(regex))
        return true;

    return false;
}

function IsElectronizrCommand(command) {
    if (command === 'exit'
        || command === 'reload')
        return true;
}

function IsValidWindowsPath(path) {
    let expression = /^[a-z]:\\(?:[^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]*$/i;
    let regex = new RegExp(expression);

    return path.match(regex);
}

function StringContainsSubstring(stringToSearch, substring) {
    let wordsOfSubstring = SplitStringToArray(substring.toLowerCase());
    stringToSearch = stringToSearch.split(' ').join('').toLowerCase();

    for (let i = 0; i < wordsOfSubstring.length; i++)
        if (stringToSearch.indexOf(wordsOfSubstring[i]) === -1)
            return false;

    return true;
}

function SearchResultListContainsValue(list, value) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].Name === value)
            return true;
    }
    return false;
}

function UpdateAppList() {
    shortCutFiles = searchService.getFilesFromDirectoriesRecursively(startMenuFolders, shortCutFileExtension);
}

function ResizeWindow() {
    ipcRenderer.sendSync('resize-window', $(selector.content).height());
}

fileWatcher.on('change', (file, stat) => {
    UpdateAppList();
});

// Input Text Change
$(selector.input).bind('input propertychange', function () {
    let input = $(this).val();
    searchResultIndex = 0;

    if (input.split(' ').join('') === '') {
        ResetGui();
        return;
    }

    searchResult = GetSearchResult(input);

    if (searchResult === undefined || searchResult.length === 0) {
        $(selector.value).html('');
        $(selector.path).html('');
        return;
    }
    else
        DisplaySearchResult();
});

// Prevent tab and arrow key from modifing input cursor 
$(window).on('keydown', e => {
    if (e.keyCode === 40 || e.keyCode === 9) {
        e.preventDefault();
    }
    if (e.keyCode == 38) {
        e.preventDefault();
    }
});

// Keyboard Events
$(selector.input).keyup(e => {
    // When user hits enter on keyboard
    if (e.keyCode === 13) {
        let input = $(selector.input).val()

        if (IsElectronizrCommand(input)) {
            HandleElectronizrCommand(input);
            return;
        }

        if (IsValidUrl(input)) {
            HandleUrlInput(input);
            return;
        }

        if (IsValidWindowsPath(input)) {
            HandleWindowsPathInput(input);
            return;
        }

        let path = $(selector.path).html();
        StartProcess(path);
    }

    // Select Next or Prev Item
    if (e.keyCode === 40 || e.keyCode === 9) {
        searchResultIndex++;
        DisplaySearchResult();
    }
    if (e.keyCode == 38) {
        searchResultIndex--;
        DisplaySearchResult();
    }
});