import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'

import FilePreviewManager from './FilePreview/FilePreviewManager'

export default class ExecutionService {
    openFileLocation(filePath) {
        filePath = path.win32.normalize(filePath)
        let command = `start explorer.exe /select,"${filePath}"`

        if (!fs.existsSync(filePath))
            return
        else
            exec(command, (err, stout, sterr) => {
                if (err) throw err
            })
    }

    getFilePreview(filePath) {
        if (!fs.existsSync(filePath))
            return
        else
            return new FilePreviewManager().getFilePreview(filePath)
    }
}