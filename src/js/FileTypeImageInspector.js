import mime from 'mime';

export default class FileTypeImageInspector {
    isValid(filePath) {
        let fileType = mime.lookup(filePath);
        return fileType.startsWith('image');
    }

    getInfoMessage(filePath) {
        return `<div>
                    <p class="app-name">Open File</p>
                    <p class="app-path">Image Preview:</p>                  
                </div>
                <div class="file-content">
                    <img src="${filePath}">
                </div>`;
    }
}