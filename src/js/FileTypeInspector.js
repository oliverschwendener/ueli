import FileTypeFolderHandler from './FileTypeHandlers/FileTypeFolderHandler';
import FileTypeImageHandler from './FileTypeHandlers/FileTypeImageHandler';
import FileTypeVideoHandler from './FileTypeHandlers/FileTypeVideoHandler';
import FileTypeTextFileHandler from './FileTypeHandlers/FileTypeTextFileHandler';
import FileTypeExeHandler from './FileTypeHandlers/FileTypeExeHandler';
import FileTypeLnkHandler from './FileTypeHandlers/FileTypeLnkHandler';

export default class FileTypeInspector {
    constructor() {
        this.inspectors = [
            new FileTypeFolderHandler(),
            new FileTypeImageHandler(),
            new FileTypeVideoHandler(),
            new FileTypeTextFileHandler(),
            new FileTypeExeHandler(),
            new FileTypeLnkHandler()
        ];
    }

    getInfoMessage(filePath) {
        filePath = filePath.toLowerCase();

        for (let inspector of this.inspectors)
            if (inspector.isValid(filePath))
                return inspector.getInfoMessage(filePath);

        return `<div>
                    <p class="result-name">Open file</p>
                    <p class="result-description">${filePath}</p>
                </div>`;
    }
}