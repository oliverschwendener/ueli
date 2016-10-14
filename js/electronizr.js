$(function () {
    var fs = require('fs');
    var os = require('os');
    var path = require('path');
    var exec = require('child_process').exec;
    var levenshtein = require('fast-levenshtein');
    var ipcRenderer = require('electron').ipcRenderer;

    var selector = {
        content: '.content',
        input: 'input',
        value: '.result-value',
        path: '.result-path',
        infoMessage: '.info-message'
    }

    var shortCutFileExtension = '.lnk';
    var startMenuFolders = [
        os.homedir() + '\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu',
        'C:\\ProgramData\\Microsoft\\Windows\\Start Menu'
    ]

    var shortCutFiles = GetFilesFromDirectoriesRecursively(startMenuFolders, shortCutFileExtension);

    var searchResult = [];
    var searchResultIndex = 0;

    var animationSpeed = 500;
    var transactionIsHandled = false;
    var maxResultItems = 10;

    function GetFilesFromDirectory(directory, fileExtension) {
        var result = [];
        var files = fs.readdirSync(directory);
        for (var i = 0; i < files.length; i++) {
            if (files[i].endsWith(fileExtension))
                result.push(files[i]);
        }
        return result;
    }

    function GetFilesFromDirectoriesRecursively(directories, fileExtension) {
        var result = [];

        for (var i = 0; i < directories.length; i++) {

            var dir = directories[i];
            var list = fs.readdirSync(dir)
            list.forEach(function (file) {
                file = dir + '/' + file;
                var stat = fs.statSync(file);
                if (stat && stat.isDirectory())
                    result = result.concat(GetFilesFromDirectoriesRecursively([file], fileExtension));
                else
                    if (path.extname(file) === fileExtension)
                        result.push(file);
            });
        }

        return result;
    };

    function DisplaySearchResult() {
        if (searchResult === undefined || searchResult.length === 0)
            return;

        if (searchResultIndex < 0)
            searchResultIndex = searchResult.length - 1;
        if (searchResultIndex > searchResult.length - 1)
            searchResultIndex = 0;

        $(selector.value).empty();
        $(selector.value).children('p').removeClass('active');

        for (var i = 0; i < searchResult.length; i++) {
            $(selector.value).append('<p id="' + i + '">' + searchResult[i].Name + '</p>');
            $(selector.value).find('#' + searchResultIndex).addClass('active');
            $(selector.path).html(searchResult[searchResultIndex].Path);
        }

        $(selector.path).html(searchResult[searchResultIndex].Path);
        ResizeWindow();
    }

    function GetSearchResult(value) {
        if (value === '') return;

        var allShortCuts = shortCutFiles;
        var apps = [];

        for (var i = 0; i < allShortCuts.length; i++) {
            var displayName = path.basename(allShortCuts[i]).replace(shortCutFileExtension, '');
            var fileName = path.basename(allShortCuts[i]).toLowerCase().replace(shortCutFileExtension, '');
            var weight = GetWeight(fileName, value.toLowerCase());

            if (!StringContainsSubstring(fileName, value)) continue;
            if (SearchResultListContainsValue(apps, displayName)) continue;

            apps.push({
                Name: displayName,
                Path: '"" "' + allShortCuts[i] + '"',
                Weight: weight
            });
        }

        var sortedResult = apps.sort(function (a, b) {
            if (a.Weight > b.Weight) return 1;
            if (a.Weight < b.Weight) return -1;
            return 0;
        });

        if (sortedResult.length > maxResultItems) {
            var newResult = [];
            for (var i = 0; i < maxResultItems; i++) {
                if (i == maxResultItems)
                    break;
                newResult.push(sortedResult[i]);
            }
            return newResult;
        }

        return sortedResult;
    }

    function StartProcess(pathToLnk) {
        if (pathToLnk === '') return;

        var cmd = exec('start ' + pathToLnk, function (error, stdout, stderr) {
            if (error) throw error;
            HideMainWindow();
        });
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
        var result = [];
        var stringToSearchWords = SplitStringToArray(stringToSearch);
        var valueWords = SplitStringToArray(value);

        for (var i = 0; i < stringToSearchWords.length; i++)
            for (var j = 0; j < valueWords.length; j++)
                result.push(levenshtein.get(stringToSearchWords[i], valueWords[j]));

        return GetAvg(result);
    }

    function GetAvg(array) {
        var sum = 0;

        for (var i = 0; i < array.length; i++)
            sum = sum + array[i];

        return sum / array.length;
    }

    function SplitStringToArray(string) {
        return string.split(/\s+/);
    }

    function StringContainsSubstring(stringToSearch, substring) {
        var wordsOfSubstring = SplitStringToArray(substring.toLowerCase());
        stringToSearch = stringToSearch.split(' ').join('').toLowerCase();

        for (var i = 0; i < wordsOfSubstring.length; i++)
            if (stringToSearch.indexOf(wordsOfSubstring[i]) === -1)
                return false;

        return true;
    }

    function SearchResultListContainsValue(list, value) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].Name === value)
                return true;
        }
        return false;
    }

    function HandleEzrCommand(command) {
        command = command.replace('ezr.', '');

        if (command === 'reload') UpdateAppList();
    }

    function UpdateAppList() {
        transactionIsHandled = true;
        shortCutFiles = GetFilesFromDirectoriesRecursively(startMenuFolders, shortCutFileExtension);
        $(selector.infoMessage).html('Updated app list');
        $(selector.infoMessage).slideDown(animationSpeed);
        setTimeout(function () {
            $(selector.infoMessage).slideUp(animationSpeed);
            setTimeout(function () {
                $(selector.infoMessage).empty();
                transactionIsHandled = false;
            }, animationSpeed);
        }, 2000);
    }

    // Input Text Change
    $(selector.input).bind('input propertychange', function () {
        var searchString = $(this).val();

        if (searchString.split(' ').join('') === '') {
            ResetGui();
            return;
        }

        searchResult = GetSearchResult(searchString);

        if (searchResult === undefined || searchResult.length === 0) {
            $(selector.value).html('');
            $(selector.path).html('');
            return;
        }
        else
            DisplaySearchResult();
    });

    // Keyboard Events
    $(selector.input).keyup(function (e) {
        // When user hits enter on keyboard
        if (transactionIsHandled) return;

        if (e.keyCode === 13) {

            var input = $(selector.input).val()

            if (input === 'exit') {
                ipcRenderer.sendSync('close-main-window');
                return;
            }

            if (input.startsWith('ezr.')) {
                HandleEzrCommand(input);
                return;
            }

            var path = $(selector.path).html();
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

    function ResizeWindow() {
        ipcRenderer.sendSync('resize-window', $(selector.content).height());
    }
});