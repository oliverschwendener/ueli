import mime from 'mime';

export default class FileTypeImageInspector {
    isValid(filePath) {
        let fileType = mime.lookup(filePath);
        return fileType.startsWith('image');
    }

    getInfoMessage(filePath) {
        return `<div>
                    <p class="result-name">Open File</p>
                    <p class="result-description">Image Preview:</p>                  
                </div>
                <div class="file-content">
                    <img src="${filePath}">
                </div>`;
    }
}