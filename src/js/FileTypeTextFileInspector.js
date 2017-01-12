import fs from 'fs';
import path from 'path';
import textextensions from 'textextensions';
import escape from 'escape-html';

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

        fileContent = escape(fileContent);

        return `<div>
                    <p class="app-name">Open file</p>
                    <p class="app-path">File preview:</p>
                </div>
                <div class="file-content">
                    <pre><code class="">${fileContent}<code></pre>
                </div>`;
    }
}