$(function(){
    var fs = require('fs');
    var os = require('os');
    var path = require('path');

    var exec = require('child_process').exec;

    var walk = function(dir) {
        var results = [];
        var list = fs.readdirSync(dir)
        list.forEach(function(file) {
            file = dir + '/' + file;
            var stat = fs.statSync(file);
            if (stat && stat.isDirectory()) results = results.concat(walk(file));
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

    console.log(shortCutFiles);
    console.log(commonShortCutFiles);

    // When user hits enter on keyboard
    $('input').keyup(function(e) {
        if(e.keyCode === 13){
            var path = '';
            StartProcess('C:\\Temp\\test2.lnk');
        }
    });

    function StartProcess(pathToLnk){
        var cmd = exec('start ' + pathToLnk, function(error, stdout, stderr){
            if(error) throw error;
        });
    }
});