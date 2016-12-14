import fs from 'fs';
import path from 'path';
import {ipcRenderer} from 'electron';
import SearchService from './js/SearchService';
import InputValidationService from './js/InputValidationService';
import ExecutionService from './js/ExecutionService';
import InputHistory from './js/InputHistory';
import Helper from './js/Helper';
import DefaultConfig from './js/DefaultConfig';

let searchService = new SearchService();
let inputValidationService = new InputValidationService();
let executionService = new ExecutionService();
let inputHistory = new InputHistory();
let helper = new Helper();

let selector = {
    content: '.content',
    input: 'input',
    value: '.result-value',
    path: '.result-path',
    icon: '#icon',
    theme: '#theme',
    noResultsMessage: '#no-search-results-message'
};

let shortCutFileExtension = '.lnk';

let fileWatcher = searchService.initializeFileWatcher();

let shortCutFiles = [];
let searchResult = [];
let searchResultIndex = 0;

let configFilePath = './config.json';
let defaultConfig = new DefaultConfig().GetConfig();
let config;

function initConfig() {
    if (fs.existsSync(configFilePath)) {
        fs.readFile(configFilePath, (err, data) => {
            if (err) throw err;
            data = JSON.parse(data);
            config = data;
            initProgram();
        });
    }
    else {
        fs.writeFile(configFilePath, JSON.stringify(defaultConfig), (err) => {
            if (err) throw err;
            loadDefaultConfig();
            initProgram();
        });
    }
}

function initProgram() {
    getShortCutFiles();
    addFoldersToFileWatcher(config.folders)
    setTheme();
}

function getShortCutFiles() {
    shortCutFiles = searchService.getFilesFromDirectoriesRecursively(config.folders, shortCutFileExtension);
}

function addFoldersToFileWatcher(folders) {
    let allSubDirs = searchService.getSubDirectoriesFromDirectoriesRecursively(folders);

    for (let folder of folders) {
        fileWatcher.add(folder);
    }

    for (let subDir of allSubDirs) {
        fileWatcher.add(subDir);
    }
}

function displaySearchResult() {
    if (searchResult === undefined || (searchResult.length === 0))
        return;

    if (searchResultIndex < 0)
        searchResultIndex = searchResult.length - 1;
    if (searchResultIndex > searchResult.length - 1)
        searchResultIndex = 0;

    $(selector.value).empty();
    $(selector.value).children('p').removeClass('active');

    for (let i = 0; i < searchResult.length; i++) {
        $(selector.value).append(`<div id="${i}"><p class="app-name">${searchResult[i].Name}</p><p class="app-path">${searchResult[i].Path}</p></div>`);
        $(selector.value).find(`#${searchResultIndex}`).addClass('active');
        $(selector.path).html(searchResult[searchResultIndex].Path);
    }

    $(selector.path).html(searchResult[searchResultIndex].Path);
}

function getSearchResult(input) {
    if (helper.stringIsUndefinedEmptyOrWhitespaces(input)) return;

    let allShortCuts = shortCutFiles;
    let apps = [];

    for (let shortcut of allShortCuts) {
        let displayName = path.basename(shortcut).replace(shortCutFileExtension, '');
        let fileName = path.basename(shortcut).toLowerCase().replace(shortCutFileExtension, '');
        let weight = searchService.getWeight(fileName, input.toLowerCase());

        if (!stringContainsSubstring(fileName, input)) continue;
        if (searchResultListContainsValue(apps, displayName)) continue;

        apps.push({
            Name: displayName,
            Path: `${shortcut}`,
            Weight: weight
        });
    }

    let customCommand = searchService.getCustomCommand(input, config.customCommands);
    if (customCommand !== undefined)
        apps.push({
            Name: path.basename(customCommand.path).replace(shortCutFileExtension, ''),
            Path: customCommand.path,
            Weight: 0
        });

    let sortedResult = apps.sort((a, b) => {
        if (a.Weight > b.Weight) return 1;
        if (a.Weight < b.Weight) return -1;
        return 0;
    });

    if (sortedResult.length > config.maxResultItems) {
        let newResult = [];
        for (let i = 0; i < config.maxResultItems; i++) {
            if (i == config.maxResultItems)
                break;
            newResult.push(sortedResult[i]);
        }
        return newResult;
    }

    return sortedResult;
}

function hideMainWindow() {
    resetGui();
    ipcRenderer.sendSync('hide-main-window');
}

function resetGui() {
    $(selector.input).val('');
    $(selector.value).empty();
    $(selector.path).empty();
    $(selector.icon).attr('class', 'fa fa-search');
}

function stringContainsSubstring(stringToSearch, substring) {
    let wordsOfSubstring = helper.splitStringToArray(substring.toLowerCase());
    stringToSearch = stringToSearch.split(' ').join('').toLowerCase();

    for (let word of wordsOfSubstring)
        if (stringToSearch.indexOf(word) === -1)
            return false;

    return true;
}

function searchResultListContainsValue(list, value) {
    for (let item of list) {
        if (item.Name === value)
            return true;
    }
    return false;
}

function setTheme() {
    let stylePath = `./css/${config.theme}-theme.css`;
    $(selector.theme).attr('href', stylePath);
}

function ChangeTheme(name) {
    config.theme = name;

    fs.writeFile(configFilePath, JSON.stringify(config), (err) => {
        if (err) throw err;
        ipcRenderer.sendSync('reload-window');
    });
}

function loadDefaultConfig() {
    config = defaultConfig;

    fs.writeFile(configFilePath, JSON.stringify(config), (err) => {
        ipcRenderer.sendSync('reload-window');
    });
}

function OpenConfigFile() {
    executionService.executeWindowsPathInput('./config.json');
}

function openFileLocation(filePath) {
    let folder = path.dirname(filePath);
    executionService.executeWindowsPathInput(folder);
}

function setInputTypeIcon(input) {
    let icon = $(selector.icon);

    icon.attr('class', 'fa fa-search');

    if (inputValidationService.isValidHttpOrHttpsUrl(input)) {
        icon.addClass('fa-globe');
    }

    if (inputValidationService.isValidWebSearch(input, config.webSearches)) {
        let iconClass = inputValidationService.getFontAwesomeIconClass(input, config.webSearches);
        icon.addClass(iconClass);
    }

    if (inputValidationService.isShellCommand(input)) {
        icon.addClass('fa-terminal');
    }

    if (inputValidationService.isValidWindowsPath(input)) {
        icon.addClass('fa-folder-o');
    }
}

function validateInputAndExecute(input) {
    if (helper.stringIsUndefinedEmptyOrWhitespaces(input))
        return;

    if (inputValidationService.isElectronizrCommand(input)) {
        executionService.executeEzrCommand(input);
        return;
    }

    if (inputValidationService.isValidWebSearch(input, config.webSearches)) {
        executionService.executeWebSearch(input, config.webSearches);
        return;
    }

    if (inputValidationService.isValidHttpOrHttpsUrl(input)) {
        executionService.executeWebUrlInput(input);
        return;
    }

    if (inputValidationService.isValidWindowsPath(input)) {
        executionService.executeWindowsPathInput(input);
        return;
    }

    if (inputValidationService.isShellCommand(input)) {
        executionService.executeShellCommand(input);
        return;
    }

    if (searchResult.length > 0) {
        let path = $(selector.path).html();
        executionService.executeProgram(path);
        resetGui();
        ipcRenderer.sendSync('hide-main-window');
    }
}

fileWatcher.on('change', (file, stat) => {
    UpdateAppList();
});

$(document).ready(function () {
    initConfig();
});

// Input Text Change
$(selector.input).bind('input propertychange', function () {
    let input = $(this).val();
    searchResultIndex = 0;

    if (helper.stringIsUndefinedEmptyOrWhitespaces(input)) {
        resetGui();
        return;
    }

    setInputTypeIcon(input);
    searchResult = getSearchResult(input);

    if (searchResult === undefined || searchResult.length === 0) {
        $(selector.value).html('<div><p class="nothing-found-message">Nothing found</p></div>');
        $(selector.path).html('');
        return;
    }
    else
        displaySearchResult();
});

// Prevent tab and arrow key from modifing input cursor 
$(window).on('keydown', e => {
    if (e.keyCode === 27) {
        ipcRenderer.send('hide-main-window');
    }
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
        let input = $(selector.input).val();

        if (!helper.stringIsUndefinedEmptyOrWhitespaces(input))
            inputHistory.addItem(input);

        validateInputAndExecute(input);
    }

    if (e.ctrlKey && e.keyCode === 79) {
        if (searchResult.length > 0)
            openFileLocation($(selector.path).html());
    }

    else if (e.keyCode === 38) {
        $(selector.input).val(inputHistory.getPrevious());
        $(selector.input).trigger('propertychange');
    }
    else if (e.keyCode === 40) {
        if (inputHistory.index < inputHistory.history.length) {
            $(selector.input).val(inputHistory.getNext());
            $(selector.input).trigger('propertychange');
        }
    }

    // Select Next with ArrowKeyDown or Tab
    else if (!e.shiftKey && e.keyCode === 9) {
        searchResultIndex++;
        displaySearchResult();
    }
    // Select Next with ArrowKeyUp or Shift+Tab
    else if (e.shiftKey && e.keyCode === 9) {
        searchResultIndex--;
        displaySearchResult();
    }
});