import fs from 'fs'

export default class Audiopreview {
    constructor() {
        this.validAudioExtensions = [
            '.mp3'
        ]
    }

    isValid(filePath) {
        for (let ext of this.validAudioExtensions)
            if (filePath.endsWith(ext))
                return true

        return false
    }

    getFilePreview(filePath) {
        return `<audio controls autoplay>
                    <source src="${filePath}">
                </audio>`
    }
}