import path from 'path';

export default class FileTypeLnkInspector {
    isValid(filePath) {
        return path.extname(filePath) === '.lnk';
    }

    getInfoMessage(filePath) {
        let fileName = path.basename(filePath).replace('.lnk', '');

        return `<div>
                    <p class="app-name">Open Shortcut</p>
                    <p class="app-path">${fileName}</p>
                </div>`;
    }
}