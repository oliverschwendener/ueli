import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { ipcRenderer } from 'electron'
import { lstatSync } from 'original-fs';

let fileIcon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                    <g id="surface1">
                        <path style=" " d="M 6 3 L 6 29 L 26 29 L 26 9.59375 L 25.71875 9.28125 L 19.71875 3.28125 L 19.40625 3 Z M 8 5 L 18 5 L 18 11 L 24 11 L 24 27 L 8 27 Z M 20 6.4375 L 22.5625 9 L 20 9 Z "></path>
                    </g>
                </svg>`

let folderIcon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                        <g id="surface1">
                            <path d="M 6 3 L 6 29 L 26 29 L 26 15.4375 L 27.71875 13.71875 L 28 13.40625 L 28 3 Z M 8 5 L 22 5 L 22 13.40625 L 22.28125 13.71875 L 24 15.4375 L 24 27 L 8 27 Z M 24 5 L 26 5 L 26 12.5625 L 25 13.5625 L 24 12.5625 Z "></path>
                        </g>
                    </svg>`


export default class FileBrowser {
    constructor() {
        this.name = 'File Browser'
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
                    icon: fileIcon
                }]
            }
        }
        else if (fs.existsSync(path.dirname(userInput))) {
            return getResultFromDirectory(path.dirname(userInput), userInput)
        }
    }
}

function getResultFromDirectory(folderPath, userInput) {
    folderPath = path.win32.normalize(folderPath)
    let folderSeparator = folderPath.endsWith('\\') ? '' : '\\'
    let files = fs.readdirSync(folderPath)
    let searchFileName = path.basename(userInput)
    let result = []

    for (let file of files) {
        try {
            let filePath = `${folderPath}${folderSeparator}${path.win32.normalize(file)}`
            let stats = fs.lstatSync(filePath)

            if (stats.isSymbolicLink())
                continue

            let isDirectory = stats.isDirectory()
            let fileName = path.basename(filePath)

            if (userInput.endsWith('\\') || filePath.toLowerCase().indexOf(searchFileName.toLowerCase()) > -1)
                result.push({
                    name: fileName,
                    execArg: filePath,
                    icon: isDirectory ? folderIcon : fileIcon
                })
        }
        catch (err) {
            continue
        }

    }

    return result
}