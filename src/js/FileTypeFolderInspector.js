import fs from 'fs';

export default class FileTypeFolderInspector {
    isValid(filePath) {
        return fs.lstatSync(filePath).isDirectory();
    }

    getInfoMessage(filePath) {
        let childitems = fs.readdirSync(filePath);
        let childItemsHtmlTag = '';

        for(let child of childitems)
            childItemsHtmlTag += `<li class="child-item">${child}</li>`;

        return `<div>
                    <p class="app-name">Open Folder</p>
                    <p class="app-path">Folder Content:</p>
                </div>
                <div class="file-content">
                    <ul class="folder-content">
                        ${childItemsHtmlTag}
                    </ul>
                </div>`;
    }
}