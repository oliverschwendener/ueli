export default class VideoPreview {
    isValid(filePath) {
        filePath = filePath.toLowerCase()
        return filePath.endsWith('.mp4')
    }

    getFilePreview(filePath) {
        return `<video controls autoplay><source src="${filePath}" type="video/mp4"></video>`
    }
}