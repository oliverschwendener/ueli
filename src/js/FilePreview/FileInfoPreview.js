import fs from 'fs'
import path from 'path'

export default class FileInfoPreview {
    getFilePreview(filePath) {
        let stats = fs.statSync(filePath)
        let fileName = path.basename(filePath)

        return `<div class="file-info-preview">
                    <h1>${fileName}</h1>
                    <p>File path: ${filePath}</p>
                    <p>File size: ${fileSizeToString(stats.size)}</p>
                    <p>Last access: ${stats.atime.toLocaleString('de-CH')}</p>
                    <p>Last modified: ${stats.mtime.toLocaleString('de-CH')}</p>
                    <p>Last changed: ${stats.ctime.toLocaleString('de-CH')}</p>
                </div>
                `
    }
}

function fileSizeToString(fileSizeInBytes) {
    let bytesInAGigabyte = 1000000000
    let bytesInAMegabyte = 1000000
    let bytesInAKilobyte = 1000

    if (fileSizeInBytes > bytesInAGigabyte)
        return `${fileSizeInBytes / bytesInAGigabyte} GB`
    if (fileSizeInBytes > bytesInAMegabyte)
        return `${fileSizeInBytes / bytesInAMegabyte} MB`
    if (fileSizeInBytes > bytesInAKilobyte)
        return `${fileSizeInBytes / bytesInAKilobyte} KB`

    return `${fileSizeInBytes} Bytes`
}