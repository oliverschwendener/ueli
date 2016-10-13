$(function(){
    var fs = require('fs');
    var os = require('os');
    var path = require('path');
    var exec = require('child_process').exec;
    var levenshtein = require('fast-levenshtein');
    var ipc = require('ipc');        

    var selector = {
        input: 'input',
        value: '.result-value',
        path: '.result-path'
    }

    var shortCutExtenstion = '.lnk';

    var walk = function(dir) {
        var results = [];
        var list = fs.readdirSync(dir)
        list.forEach(function(file) {
            file = dir + '/' + file;
            var stat = fs.statSync(file);
            if (stat && stat.isDirectory())
                results = results.concat(walk(file));
            else
                if(path.extname(file) === shortCutExtenstion) 
                    results.push(file);
        });
        return results;
    };

    var homeDir = os.homedir();
    var userStartMenuFolderPath = homeDir + '\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu';
    var commonStartMenuFolderPath = 'C:\\ProgramData\\Microsoft\\Windows\\Start Menu';

    var shortCutFiles = walk(userStartMenuFolderPath);
    var commonShortCutFiles = walk(commonStartMenuFolderPath);

    var searchResult = [];
    var searchResultIndex = 0;

    function DisplaySearchResult(){
        if(searchResult === undefined || searchResult.length === 0)
            return;

        if(searchResultIndex < 0)
            searchResultIndex = searchResult.length - 1;
        if(searchResultIndex > searchResult.length - 1)
            searchResultIndex = 0;

        $(selector.value).html(searchResult[searchResultIndex].Name);
        $(selector.path).html(searchResult[searchResultIndex].Path);
    }

    function GetSearchResult(value){
        if(value === '') return;

        var allShortCuts = shortCutFiles.concat(commonShortCutFiles);
        var apps = [];

        for(var i = 0; i < allShortCuts.length; i++){
            var fileName = path.basename(allShortCuts[i]).toLowerCase().replace(shortCutExtenstion, '');
            var search = value.toLowerCase();
            var weight = GetWeight(fileName, search);

            //if(fileName.indexOf(search) === -1) continue;
            if(!StringContainsSubstring(fileName, value)) continue;

            apps.push({
                Name: path.basename(allShortCuts[i]).replace(shortCutExtenstion, ''),
                Path: allShortCuts[i],
                Weight: weight
            });
        }

        var sortedResult = apps.sort(function(a, b){
            if (a.Weight > b.Weight) return 1;
            if (a.Weight < b.Weight) return -1;
            return 0;
        });

        return sortedResult;
    }

    function StartProcess(pathToLnk){
        if($(selector.input).val() === 'exit'){
            ipc.send('close-main-window');
            return;
        }

        if(pathToLnk === '') return;

        var cmd = exec('start "" "' + pathToLnk + '"', function(error, stdout, stderr){
            if(error) throw error;
            
            HideMainWindow();
        });
    }

    function HideMainWindow(){
        ResetGui();
        ipc.send('hide-main-window');
    }

    function ResetGui(){
        $(selector.input).val('');
        $(selector.value).empty();
        $(selector.path).empty();
    }

    // Input Text Change
    $(selector.input).bind('input propertychange', function(){
        var searchString = $(this).val();

        searchResult = GetSearchResult(searchString);

        if(searchResult === undefined || searchResult.length === 0){
            $(selector.value).html('');
            $(selector.path).html('');
            return;
        }
        else
            DisplaySearchResult();                
    });

    // Keyboard Events
    $(selector.input).keyup(function(e){
        // When user hits enter on keyboard
        if(e.keyCode === 13){
            var path = $(selector.path).html();
            StartProcess(path);
        }

        // Select Next or Prev Item
        if(e.keyCode === 40 || e.keyCode === 9){
            searchResultIndex++;
            DisplaySearchResult();
        }
    });

    function GetWeight(stringToSearch, value){
        var result = [];
        var stringToSearchWords = SplitStringToArray(stringToSearch);
        var valueWords = SplitStringToArray(value);

        for(var i = 0; i < stringToSearchWords.length; i++){
            for(var j = 0; j < valueWords.length; j++){
                result.push(levenshtein.get(stringToSearchWords[i], valueWords[j]));
            }   
        }
        return GetAvg(result);
    }

    function GetAvg(array){
        var sum = 0;

        for(var i = 0; i < array.length; i++){
            sum = sum + array[i];
        }

        return sum / array.length;
    }

    function SplitStringToArray(string){
        return string.split(/\s+/);
    }

    function StringContainsSubstring(stringToSearch, substring){
        var wordsOfSubstring = SplitStringToArray(substring.toLowerCase());
        stringToSearch = stringToSearch.split(' ').join('').toLowerCase();

        console.log(wordsOfSubstring, stringToSearch);

        for(var i = 0; i < wordsOfSubstring.length; i++){
            console.log(stringToSearch, wordsOfSubstring[i], stringToSearch.indexOf(wordsOfSubstring[i]));

            if(stringToSearch.indexOf(wordsOfSubstring[i]) === -1)
                return false;
        }


        return true;
    }
});