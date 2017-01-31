import path from 'path';

export default class FileTypeLnkInspector {
    isValid(filePath) {
        return path.extname(filePath) === '.lnk';
    }

    getInfoMessage(filePath) {
        let fileName = path.basename(filePath).replace('.lnk', '');

        return `<div>
                    <p class="result-name">Open Shortcut</p>
                    <p class="result-description">${fileName}</p>
                </div>`;
    }
}