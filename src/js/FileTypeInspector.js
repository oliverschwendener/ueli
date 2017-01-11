import FileTypeFolderInspector from './FileTypeFolderInspector.js';
import FileTypeImageInspector from './FileTypeImageInspector.js';
import FileTypeVideoInspector from './FileTypeVideoInspector.js';
import FileTypeTextFileInspector from './FileTypeTextFileInspector.js';

export default class FileTypeInspector {
    constructor() {
        this.inspectors = [
            new FileTypeFolderInspector(),
            new FileTypeImageInspector(),
            new FileTypeVideoInspector(),
            new FileTypeTextFileInspector()
        ];
    }

    getInfoMessage(filePath) {  
        for (let inspector of this.inspectors)
            if (inspector.isValid(filePath))
                return inspector.getInfoMessage(filePath);

        return `<div>
                    <p class="app-name">Open file</p>
                    <p class="app-path">${filePath}</p>
                </div>`;
    }
}