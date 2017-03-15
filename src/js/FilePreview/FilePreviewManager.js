import ImagePreview from './ImagePreview'
import VideoPreview from './VideoPreview'
import TextPreview from './TextPreview'
import FolderPreview from './FolderPreview'
import FileInfoPreview from './FileInfoPreview'

export default class FilePreviewManager {
    constructor() {
        this.previewServices = [
            new ImagePreview(),
            new VideoPreview(),
            new TextPreview(),
            new FolderPreview()
        ]
    }

    getFilePreview(filePath) {
        let result
        let service = this.getValidFilePreviewService(filePath)

        if (service !== undefined)
            result = service.getFilePreview(filePath)
        else
            result = new FileInfoPreview().getFilePreview(filePath)

        return result
    }

    getValidFilePreviewService(filePath) {
        for (let previewService of this.previewServices)
            if (previewService.isValid(filePath))
                return previewService
    }
}