'use strict';

import fs from 'fs';
import path from 'path';

export default class FileSystemSearch {
    getFilesFromDirectoriesRecursivelyByFileExtension(directories, fileExtension) {
        let result = [];

        for (let directory of directories) {
            let dir = directory;
            let list = fs.readdirSync(dir);
            list.forEach((file) => {
                file = `${dir}/${file}`;
                let stat = fs.statSync(file);
                if (stat && stat.isDirectory())
                    result = result.concat(this.getFilesFromDirectoriesRecursivelyByFileExtension([file], fileExtension));
                else
                if (path.extname(file).toLowerCase() === fileExtension.toLowerCase())
                    result.push(file);
            }, this);
        }
        return result;
    }
}
