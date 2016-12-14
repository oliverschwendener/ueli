import {exec} from 'child_process';
import fs from 'fs';
import path from 'path';

export default class FilePathExecutor {
    isValid(path) {
        /*
        let expression = /^[a-z]:\\(?:[^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]*$/i;
        let regex = new RegExp(expression);
        return path.match(regex);
        */

        return fs.existsSync(path);
    }

    execute(path) {
        exec(`start "" "${path}"`, (error, stdout, stderr) => {
            if (error)
                throw error;
        });
    }

    openFileLocation(filePath) {
        let fileLocation = path.dirname(filePath);
        this.execute(fileLocation);
    }
}