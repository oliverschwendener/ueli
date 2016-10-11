$(function(){
    var fs = require('fs');
    var os = require('os');
    var path = require('path');
    var exec = require('child_process').exec;
    var levenshtein = require('fast-levenshtein');        

    var walk = function(dir) {
        var results = [];
        var list = fs.readdirSync(dir)
        list.forEach(function(file) {
            file = dir + '/' + file;
            var stat = fs.statSync(file);
            if (stat && stat.isDirectory())
                results = results.concat(walk(file));
            else
                if(path.extname(file) === '.lnk' || path.extname(file) === '.exe') 
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

    // Input Text Change
    $('input').bind('input propertychange', function(){
        var searchString = $(this).val();
        searchResult = GetSearchResult(searchString);

        if(searchResult === undefined || searchResult.length === 0){
            $('.result-value').html('');
            $('.result-path').html('');
            return;
        }
        else
            DisplaySearchResult();                
    });

    function DisplaySearchResult(){
        if(searchResult === undefined || searchResult.length === 0)
            return;

        if(searchResultIndex < 0)
            searchResultIndex = searchResult.length - 1;
        if(searchResultIndex > searchResult.length - 1)
            searchResultIndex = 0;

        $('.result-value').html(searchResult[searchResultIndex].Name);
        $('.result-path').html(searchResult[searchResultIndex].Path);
    }

    function GetSearchResult(value){
        if(value === '') return;

        var allShortCuts = shortCutFiles.concat(commonShortCutFiles);
        var apps = [];

        for(var i = 0; i < allShortCuts.length; i++){
            var fileName = path.basename(allShortCuts[i]).toLowerCase().replace('.lnk', '');
            var search = value.toLowerCase();
            var weight = levenshtein.get(fileName, search);

            if(fileName.indexOf(search) === -1) continue;

            apps.push({
                Name: path.basename(allShortCuts[i]).replace('.lnk', ''),
                Path: allShortCuts[i],
                Weight: weight
            });
        }

        var sortedList = apps.sort(function(a, b){
            if (a.Weight > b.Weight) return 1;
            if (a.Weight < b.Weight) return -1;
            return 0;
        });

        return sortedList;
    }

    // Keyboard Events
    $('input').keyup(function(e) {
        // When user hits enter on keyboard
        if(e.keyCode === 13){
            var path = $('.result-path').html();
            StartProcess(path);
        }

        // Select Next or Prev Item
        if(e.keyCode === 40 || e.keyCode === 9){
            searchResultIndex++;
            DisplaySearchResult();
        }
        if(e.keyCode === 38){
            searchResultIndex--;
            DisplaySearchResult;
        }
    });

    function StartProcess(pathToLnk){
        if(pathToLnk === '') return;

        var cmd = exec('start "" "' + pathToLnk + '"', function(error, stdout, stderr){
            if(error) throw error;
            
            mainWindow.hide();
        });
    }
});