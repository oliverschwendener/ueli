import path from 'path';

export default class FileTypeExeHandler {
    isValid(filePath) {
        return path.extname(filePath) === '.exe';
    }

    getInfoMessage(filePath) {
        let fileName = path.basename(filePath);

        return `<div>
                    <p class="result-name">Execute file</p>
                    <p class="result-description">${fileName}</p>
                </div>`;
    }
}