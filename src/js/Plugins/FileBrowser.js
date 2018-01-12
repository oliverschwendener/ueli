import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { ipcRenderer } from 'electron'

export default class FileBrowser {
    constructor() {
        this.name = 'File Browser'
        this.icon = 'fa fa-file'
    }

    getName() {
        return this.name
    }

    isValid(filePath) {
        let regex = new RegExp(/[a-z]:[\\/]/ig)
        return regex.test(filePath) && (fs.existsSync(filePath) || fs.existsSync(path.dirname(filePath)))
    }

    execute(filePath) {
        exec(`start "" "${filePath}"`, (err, stdout, sterr) => {
            if (err)
                throw err
            else
                ipcRenderer.send('hide-main-window')
        })
    }

    getSearchResult(userInput) {
        if (fs.existsSync(userInput)) {
            let filePath = userInput
            let stats = fs.lstatSync(filePath)
            if (stats.isDirectory()) {
                return getResultFromDirectory(filePath, userInput)
            }
            else if (stats.isFile()) {
                return [{
                    name: path.basename(filePath),
                    execArg: filePath,
                }]
            }
        }
        else if (fs.existsSync(path.dirname(userInput))) {
            return getResultFromDirectory(path.dirname(userInput), userInput)
        }
    }

    getIcon() {
        return this.icon
    }
}

function getResultFromDirectory(folderPath, userInput) {
    folderPath = path.win32.normalize(folderPath)
    let folderSeparator = folderPath.endsWith('\\') ? '' : '\\'
    let files = fs.readdirSync(folderPath)
    let searchFileName = path.basename(userInput)
    let result = []

    for (let file of files) {
        let filePath = `${folderPath}${folderSeparator}${path.win32.normalize(file)}`
        let fileName = path.basename(filePath)

        if (userInput.endsWith('\\') || filePath.toLowerCase().indexOf(searchFileName.toLowerCase()) > -1)
            result.push({
                name: fileName,
                execArg: filePath
            })
    }

    return result
}