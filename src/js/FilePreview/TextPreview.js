import fs from 'fs'
import path from 'path'
import textextensions from 'textextensions'
import escape from 'escape-html'

export default class TextPreview {
    isValid(filePath) {
        let fileExtension = path.extname(filePath).replace('.', '')

        for (let textextension of textextensions)
            if (textextension === fileExtension)
                return true

        return false
    }

    getFilePreview(filePath) {
        let fileContent

        try {
            fileContent = fs.readFileSync(filePath)
        }
        catch (exception) {
            fileContent = exception
        }

        fileContent = escape(fileContent)

        return `<pre><code id="text-file-preview" class="">${fileContent}</code></pre>`
    }
}