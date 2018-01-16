import fs from 'fs'
import path from 'path'

export default class FolderPreview {
    isValid(filePath) {
        let stats = fs.statSync(filePath)
        return stats.isDirectory() && !stats.isSymbolicLink()
    }

    getFilePreview(filePath) {
        let folders = []
        let files = []

        let children = fs.readdirSync(filePath)
        let childrenHtml = ''

        for (let child of children) {
            let fileStats = fs.statSync(`${filePath}/${child}`)
            if (fileStats.isSymbolicLink())
                continue

            if (fileStats.isDirectory())
                folders.push(child)
            else
                files.push(child)
        }

        let foldersInnerHtml = ''
        for (let folder of folders)
            foldersInnerHtml += `<li>${folder}</li>`

        let foldersOuterHtml = folders.length > 0
            ? `<h3>Folders:</h3><ul>${foldersInnerHtml}</ul>`
            : ''

        let filesInnerHtml = ''
        for (let file of files)
            filesInnerHtml += `<li>${file}</li>`

        let filesOuterHtml = files.length > 0
            ? `<h3>Files</h3><ul>${filesInnerHtml}</ul>`
            : ''

        return `<div class="folder-preview">    
                    ${foldersOuterHtml}
                    ${filesOuterHtml}
                </div>`
    }
}