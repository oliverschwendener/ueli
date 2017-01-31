import mime from 'mime';

export default class FileTypeVideoInspector {
    isValid(filePath) {
        let fileType = mime.lookup(filePath);
        return fileType.startsWith('video');
    }

    getInfoMessage(filePath) {
        return `<div>
                    <p class="result-name">Open File</p>
                    <p class="result-description">Video Preview:</p>
                </div>
                <div class="file-content">
                    <video src="${filePath}" autoplay loop muted>
                </div>`;
    }
}