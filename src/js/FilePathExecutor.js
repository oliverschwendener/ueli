import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import FileTypeInspector from './FileTypeInspector.js';

export default class FilePathExecutor {
    constructor() {
        this.fileTypeInspector = new FileTypeInspector();
    }

    isValid(filePath) {
        filePath = this.replaceFilePrefix(filePath);
        filePath = this.getParentDirIfFileDoesntExist(filePath);

        return fs.existsSync(filePath) && (/[a-zA-Z]:[\\/]/g).test(filePath);
    }

    execute(filePath) {
        exec(`start "" "${filePath}"`, (error, stdout, stderr) => {
            if (error)
                throw error;
        });
    }

    openFileLocation(filePath) {
        let fileLocation = path.dirname(filePath);
        this.execute(fileLocation);
    }

    getInfoMessage(filePath) {
        filePath = this.replaceFilePrefix(filePath);
        filePath = this.getParentDirIfFileDoesntExist(filePath);
        
        return this.fileTypeInspector.getInfoMessage(filePath);
    }

    getIcon() {
        return 'fa fa-folder-o';
    }

    replaceFilePrefix(filePath) {
        let filePrefix = 'file:///';
        return filePath.replace(filePrefix, '');
    }

    getParentDirIfFileDoesntExist(filePath) {
        if (!fs.existsSync(filePath))
            filePath = path.dirname(filePath);

        return filePath;
    }
}