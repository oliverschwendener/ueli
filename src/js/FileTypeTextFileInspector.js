import fs from 'fs';
import mime from 'mime';

export default class FileTypeTextFileInspector {
    isValid(filePath) {
        let result = false;

        try{
            fs.readFileSync(filePath)
            result = true;
        }
        catch(exception) {
            console.log(exception);
            result = false;
        }

        return result;
    }

    getInfoMessage(filePath) {
        let fileContent;
        
        try{
            fileContent = fs.readFileSync(filePath);
        }
        catch(exception) {
            fileContent = exception;
        }

        return `<div>
                    <p class="app-name">Open File</p>
                    <p class="app-path">File Content:</p>
                </div>
                <div class="file-content">
                    <pre>${fileContent}</pre>
                </div>`;
    }
}