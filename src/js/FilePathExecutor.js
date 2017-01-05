import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

export default class FilePathExecutor {
    isValid(path) {
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

    getInfoMessage(path) {
        return `<div>
                    <p class="app-name">Open file or folder</p>
                    <p class="app-path">${path}</p>
                </div>`;
    }

    getIcon() {
        return 'fa fa-folder-o';
    }
}