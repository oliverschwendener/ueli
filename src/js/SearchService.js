import fs from 'fs';
import fsWatcher from 'filewatcher';
import path from 'path';
import Helper from './Helper';
import levenshtein from 'fast-levenshtein';

let helper = new Helper();

export default class SearchService {

    initializeFileWatcher(foldersToWatch) {
        return fsWatcher();
    }

    GetSubDirectoriesFromDirectoriesRecursively(directories) {
        let result = [];

        for (let directory of directories) {
            let dir = directory;
            let list = fs.readdirSync(dir);
            list.forEach((file) => {
                file = dir + '/' + file;
                let stat = fs.statSync(file);
                if (stat && stat.isDirectory()) {
                    result.push(file);
                    result = result.concat(this.GetSubDirectoriesFromDirectoriesRecursively([file]));
                }
            }, this);
        }
        return result;
    }

    GetFilesFromDirectoriesRecursively(directories, fileExtension) {
        let result = [];

        for (let directory of directories) {
            let dir = directory;
            let list = fs.readdirSync(dir);
            list.forEach((file) => {
                file = `${dir}/${file}`;
                let stat = fs.statSync(file);
                if (stat && stat.isDirectory())
                    result = result.concat(this.GetFilesFromDirectoriesRecursively([file], fileExtension));
                else
                    if (path.extname(file).toLowerCase() === fileExtension.toLowerCase())
                        result.push(file);
            }, this);
        }
        return result;
    }

    GetFilesFromDirectory(directory, fileExtension) {
        let result = [];
        let files = fs.readdirSync(directory);
        for (let file of files) {
            if (path.extname(file).toLowerCase() === fileExtension.toLowerCase())
                result.push(file);
        }
        return result;
    }

    GetWeight(stringToSearch, value) {
        let result = [];
        let stringToSearchWords = helper.SplitStringToArray(stringToSearch);
        let valueWords = helper.SplitStringToArray(value);

        for (let word of stringToSearchWords)
            for (let value of valueWords)
                result.push(levenshtein.get(word, value));

        return helper.GetAvg(result);
    }

    GetCustomCommand(command, allCustomCommands) {
        for (let customCommand of allCustomCommands) {
            if (command === customCommand.code)
                return customCommand;
        }

        return undefined;
    }
}