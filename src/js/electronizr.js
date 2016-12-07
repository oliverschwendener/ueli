import os from 'os';
import fs from 'fs';
import path from 'path';
import { ipcRenderer } from 'electron';
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
    inputTypeIcon: '.input-type-icon',
    theme: '#theme'
};

let shortCutFileExtension = '.lnk';

let fileWatcher = searchService.initializeFileWatcher();

let shortCutFiles = [];
let searchResult = [];
let searchResultIndex = 0;

let configFilePath = './config.json';
let defaultConfig = new DefaultConfig().GetConfig();
let config;

function InitConfig() {
    if (fs.existsSync(configFilePath)) {
        fs.readFile(configFilePath, (err, data) => {
            if (err) throw err;
            data = JSON.parse(data);
            config = data;
            InitProgram();
        });
    }
    else {
        fs.writeFile(configFilePath, JSON.stringify(defaultConfig), (err) => {
            if (err) throw err;
            LoadDefaultConfig();
            InitProgram();
        });
    }
}

function InitProgram() {
    GetShortCutFiles();
    AddFoldersToFileWatcher(config.folders)
    SetTheme();
}

function GetShortCutFiles() {
    shortCutFiles = searchService.GetFilesFromDirectoriesRecursively(config.folders, shortCutFileExtension);
}

function AddFoldersToFileWatcher(folders) {
    let allSubDirs = searchService.GetSubDirectoriesFromDirectoriesRecursively(folders);

    for (let folder of folders) {
        fileWatcher.add(folder);
    }

    for (let subDir of allSubDirs) {
        fileWatcher.add(subDir);
    }
}

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
        $(selector.value).append(`<p id="${i}">${searchResult[i].Name}</p>`);
        $(selector.value).find(`#${searchResultIndex}`).addClass('active');
        $(selector.path).html(searchResult[searchResultIndex].Path);
    }

    $(selector.path).html(searchResult[searchResultIndex].Path);
    ResizeWindow();
}

function GetSearchResult(input) {
    if (helper.StringIsUndefinedEmptyOrWhitespaces(input)) return;

    let allShortCuts = shortCutFiles;
    let apps = [];

    for (let shortcut of allShortCuts) {
        let displayName = path.basename(shortcut).replace(shortCutFileExtension, '');
        let fileName = path.basename(shortcut).toLowerCase().replace(shortCutFileExtension, '');
        let weight = searchService.GetWeight(fileName, input.toLowerCase());

        if (!StringContainsSubstring(fileName, input)) continue;
        if (SearchResultListContainsValue(apps, displayName)) continue;

        apps.push({
            Name: displayName,
            Path: `${shortcut}`,
            Weight: weight
        });
    }

    let customCommand = searchService.GetCustomCommand(input, config.customCommands);
    console.log(customCommand);
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

function HideMainWindow() {
    ResetGui();
    ipcRenderer.sendSync('hide-main-window');
}

function ResetGui() {
    $(selector.input).val('');
    $(selector.value).empty();
    $(selector.path).empty();
    $(selector.inputTypeIcon).attr('class', 'fa input-type-icon');
    ResizeWindow();
}

function StringContainsSubstring(stringToSearch, substring) {
    let wordsOfSubstring = helper.SplitStringToArray(substring.toLowerCase());
    stringToSearch = stringToSearch.split(' ').join('').toLowerCase();

    for (let word of wordsOfSubstring)
        if (stringToSearch.indexOf(word) === -1)
            return false;

    return true;
}

function SearchResultListContainsValue(list, value) {
    for (let item of list) {
        if (item.Name === value)
            return true;
    }
    return false;
}

function ResizeWindow() {
    let height = $(selector.content).height();
    ipcRenderer.sendSync('resize-window', height);
}

function SetTheme() {
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

function LoadDefaultConfig() {
    config = defaultConfig;

    fs.writeFile(configFilePath, JSON.stringify(config), (err) => {
        ipcRenderer.sendSync('reload-window');
    });
}

function OpenConfigFile() {
    executionService.HandleWindowsPathInput('./config.json');
}

function OpenFileLocation(filePath) {
    let folder = path.dirname(filePath);
    console.log(folder);
    executionService.HandleWindowsPathInput(folder);
}

function SetInputTypeIcon(input) {
    let icon = $(selector.inputTypeIcon);

    icon.attr('class', 'fa input-type-icon');

    if (inputValidationService.IsValidHttpOrHttpsUrl(input)) {
        icon.addClass('fa-globe');
    }

    if (inputValidationService.IsValidWebSearch(input, config.webSearches)) {
        let iconClass = inputValidationService.GetFontAwesomeIconClass(input, config.webSearches);
        icon.addClass(iconClass);
    }

    if (inputValidationService.IsShellCommand(input)) {
        icon.addClass('fa-terminal');
    }

    if (inputValidationService.IsValidWindowsPath(input)) {
        icon.addClass('fa-folder-o');
    }
}

function ValidateInputAndExecute(input) {
    if (helper.StringIsUndefinedEmptyOrWhitespaces(input))
        return;

    if (inputValidationService.IsElectronizrCommand(input)) {
        executionService.HandleElectronizrCommand(input);
        return;
    }

    if (inputValidationService.IsValidWebSearch(input, config.webSearches)) {
        executionService.HandleWebSearch(input, config.webSearches);
        return;
    }

    if (inputValidationService.IsValidHttpOrHttpsUrl(input)) {
        executionService.HandleUrlInput(input);
        return;
    }

    if (inputValidationService.IsValidWindowsPath(input)) {
        executionService.HandleWindowsPathInput(input);
        return;
    }

    if (inputValidationService.IsShellCommand(input)) {
        executionService.HandleShellCommand(input);
        return;
    }

    if (searchResult.length > 0) {
        let path = $(selector.path).html();
        executionService.HandleStartProgram(path);
        ResetGui();
        ipcRenderer.sendSync('hide-main-window');
    }
}

fileWatcher.on('change', (file, stat) => {
    UpdateAppList();
});

$(document).ready(function() {
    InitConfig();
});

// Input Text Change
$(selector.input).bind('input propertychange', function() {
    let input = $(this).val();
    searchResultIndex = 0;

    if (helper.StringIsUndefinedEmptyOrWhitespaces(input)) {
        ResetGui();
        return;
    }

    SetInputTypeIcon(input);
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

        if (!helper.StringIsUndefinedEmptyOrWhitespaces(input))
            inputHistory.addItem(input);

        ValidateInputAndExecute(input);
    }

    if (e.ctrlKey && e.keyCode === 79) {
        if (searchResult.length > 0)
            OpenFileLocation($(selector.path).html());
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
        DisplaySearchResult();
    }
    // Select Next with ArrowKeyUp or Shift+Tab
    else if (e.shiftKey && e.keyCode === 9) {
        searchResultIndex--;
        DisplaySearchResult();
    }
});