import fs from 'fs';
import fsWatcher from 'filewatcher';
import path  from 'path';

export default class SearchService {
    initializeFileWatcher(foldersToWatch) {
        let result = fsWatcher();
        for (var i = 0; i < foldersToWatch.length; i++) {
            result.add(foldersToWatch[i]);
        }
        return result;
    }

      getFilesFromDirectoriesRecursively(directories, fileExtension) {
        let result = [];

        for (var i = 0; i < directories.length; i++) {
            let dir = directories[i];
            let list = fs.readdirSync(dir);
            list.forEach( (file) => {
                file = dir + '/' + file;
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
        for (var i = 0; i < files.length; i++) {
           if (path.extname(files[i]).toLowerCase() === fileExtension.toLowerCase())
               result.push(files[i]);
        }
        return result;
    }
}