import fs from 'fs';
import fsWatcher from 'filewatcher';
import path from 'path';

export default class SearchService {
    initializeFileWatcher(foldersToWatch) {
        let fileWatcher = fsWatcher();
        let allSubDirs = this.getSubDirectoriesFromDirectoriesRecursively(foldersToWatch);

        for (let folder of foldersToWatch) {
            fileWatcher.add(folder);
        }

        for (let subDir of allSubDirs) {
            fileWatcher.add(subDir);
        }
        return fileWatcher;
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
}