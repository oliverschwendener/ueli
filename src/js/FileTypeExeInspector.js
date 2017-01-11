import path from 'path';

export default class FileTypeExeInspector {
    isValid(filePath) {
        return path.extname(filePath) === '.exe';
    }

    getInfoMessage(filePath) {
        let fileName = path.basename(filePath);

        return `<div>
                    <p class="app-name">Execute file</p>
                    <p class="app-path">${fileName}</p>
                </div>`;
    }
}