import fs from 'fs'
import path from 'path'

let fileIcon = 'fa fa-file-o'
let folderIcon = 'fa fa-folder'

export default class FolderPreview {
    isValid(filePath) {
        let stats = fs.statSync(filePath)
        return stats.isDirectory() && !stats.isSymbolicLink()
    }

    getFilePreview(filePath) {
        let children = fs.readdirSync(filePath)
        let childrenHtml = ''

        for (let child of children) {
            let fileStats = fs.statSync(`${filePath}/${child}`)
            let icon = fileStats.isDirectory() && !fileStats.isSymbolicLink()
                ? folderIcon
                : fileIcon

            childrenHtml += `<li><i class="${icon}"></i>${child}</li>`
        }

        return `<div class="folder-preview">
                    <h1>${filePath}</h1>
                    <ul>
                        ${childrenHtml}
                    </ul>
                </div>`
    }
}