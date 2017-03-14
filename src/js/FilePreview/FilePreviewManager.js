import ImagePreview from './ImagePreview'
import TextPreview from './TextPreview'

export default class FilePreviewManager {
    constructor() {
        this.previewServices = [
            new ImagePreview(),
            new TextPreview()
        ]
    }

    getFilePreview(filePath) {
        let service = this.getValidFilePreviewService(filePath)
        if (service !== undefined)
            return service.getFilePreview(filePath)
    }

    getValidFilePreviewService(filePath) {
        for (let previewService of this.previewServices)
            if (previewService.isValid(filePath))
                return previewService
    }
}