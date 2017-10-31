export default class ImagePreview{
    isValid(filePath) {
        filePath = filePath.toLowerCase()
        return filePath.endsWith('.jpg')
            || filePath.endsWith('.jpeg')
            || filePath.endsWith('.png')
            || filePath.endsWith('.gif')
    }

    getFilePreview(filePath) {
        return `<img src="${filePath}">`
    }
}