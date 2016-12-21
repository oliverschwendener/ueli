'use strict';

import fs from 'fs';
import path from 'path';

export default class FileSystemSearch {
    getFilesFromDirectoriesRecursivelyByFileExtension(directories, fileExtension = '*') {
        let result = [];

        for (let directory of directories) {
            let dir = directory;
            try {
                let list = fs.readdirSync(dir);
                list.forEach((file) => {
                    file = `${dir}/${file}`;
                    let stat = fs.lstatSync(file);
                    if (stat && stat.isDirectory() && !stat.isSymbolicLink())
                        try{
                            result = result.concat(this.getFilesFromDirectoriesRecursivelyByFileExtension([file], fileExtension));
                        }
                        catch(err) {
                            throw err;
                        }
                    else
                        if (fileExtension === '*')
                            result.push(file);
                        else if (path.extname(file).toLowerCase() === fileExtension.toLowerCase())
                            result.push(file);
                }, this);
            }     
            catch(err) {
                console.log(err);
            }
        }
        return result;
    }
}
