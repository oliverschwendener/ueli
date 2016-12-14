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

    getSubDirectoriesFromDirectoriesRecursively(directories) {
        let result = [];

        for (let directory of directories) {
            let dir = directory;
            let list = fs.readdirSync(dir);
            list.forEach((file) => {
                file = dir + '/' + file;
                let stat = fs.statSync(file);
                if (stat && stat.isDirectory()) {
                    result.push(file);
                    result = result.concat(this.getSubDirectoriesFromDirectoriesRecursively([file]));
                }
            }, this);
        }
        return result;
    }

    getFilesFromDirectoriesRecursively(directories, fileExtension) {
        let result = [];

        for (let directory of directories) {
            let dir = directory;
            let list = fs.readdirSync(dir);
            list.forEach((file) => {
                file = `${dir}/${file}`;
                let stat = fs.statSync(file);
                if (stat && stat.isDirectory())
                    result = result.concat(this.getFilesFromDirectoriesRecursively([file], fileExtension));
                else
                    if (path.extname(file).toLowerCase() === fileExtension.toLowerCase())
                        result.push(file);
            }, this);
        }
        return result;
    }

    getFilesFromDirectory(directory, fileExtension) {
        let result = [];
        let files = fs.readdirSync(directory);
        for (let file of files) {
            if (path.extname(file).toLowerCase() === fileExtension.toLowerCase())
                result.push(file);
        }
        return result;
    }

    getWeight(stringToSearch, value) {
        let result = [];
        let stringToSearchWords = helper.splitStringToArray(stringToSearch);
        let valueWords = helper.splitStringToArray(value);

        for (let word of stringToSearchWords)
            for (let value of valueWords)
                result.push(levenshtein.get(word, value));

        return helper.getAvg(result);
    }

    getCustomCommand(command, allCustomCommands) {
        for (let customCommand of allCustomCommands) {
            if (command === customCommand.code)
                return customCommand;
        }

        return undefined;
    }
}