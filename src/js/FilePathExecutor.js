import {exec} from 'child_process';
import fs from 'fs';

export default class FilePathExecutor {
    isValid(path) {
        let expression = /^[a-z]:\\(?:[^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]*$/i;
        let regex = new RegExp(expression);

        return (path.match(regex) && fs.existsSync(path));
    }

    execute(path) {
        exec(`start "" "${path}"`, (error, stdout, stderr) => {
            if (error)
                throw error;
        });
    }
}