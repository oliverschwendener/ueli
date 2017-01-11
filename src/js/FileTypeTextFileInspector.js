import fs from 'fs';
import path from 'path';
import textextensions from 'textextensions';

export default class FileTypeTextFileInspector {
    isValid(filePath) {
        let fileExtension = path.extname(filePath).replace('.', '');
        for (let ext of textextensions)
            if (ext === fileExtension)
                return true;

        return false;
    }

    getInfoMessage(filePath) {
        let fileContent;

        try {
            fileContent = fs.readFileSync(filePath);
        }
        catch (exception) {
            fileContent = exception;
        }

        return `<div>
                    <p class="app-name">Open file</p>
                    <p class="app-path">File preview:</p>
                </div>
                <div class="file-content">
                    <pre>${fileContent}</pre>
                </div>`;
    }
}