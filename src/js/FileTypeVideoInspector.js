import mime from 'mime';

export default class FileTypeVideoInspector {
    isValid(filePath) {
        let fileType = mime.lookup(filePath);
        return fileType.startsWith('video');
    }

    getInfoMessage(filePath) {
        return `<div>
                    <p class="app-name">Open File</p>
                    <p class="app-path">Video Preview:</p>
                </div>
                <div class="file-content">
                    <video src="${filePath}" autoplay loop muted>
                </div>`;
    }
}