import FileTypeFolderInspector from './FileTypeFolderInspector';
import FileTypeImageInspector from './FileTypeImageInspector';
import FileTypeVideoInspector from './FileTypeVideoInspector';
import FileTypeTextFileInspector from './FileTypeTextFileInspector';
import FileTypeExeInspector from './FileTypeExeInspector';
import FileTypeLnkInspector from './FileTypeLnkInspector';

export default class FileTypeInspector {
    constructor() {
        this.inspectors = [
            new FileTypeFolderInspector(),
            new FileTypeImageInspector(),
            new FileTypeVideoInspector(),
            new FileTypeTextFileInspector(),
            new FileTypeExeInspector(),
            new FileTypeLnkInspector()
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