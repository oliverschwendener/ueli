import fs from 'fs'
import { exec } from 'child_process'
import StringHelpers from './../Helpers/StringHelpers'
import { ipcRenderer } from 'electron';

let stringHelpers = new StringHelpers()

export default class HomeFolderPlugin {
    constructor() {
        this.name = 'Home Folder'
        this.homeFolderPath = process.env.USERPROFILE;
        this.files = this.getFiles()
    }

    getName() {
        return this.name
    }

    isValid(userInput) {
        for (let file of this.files) {
            if (this.userInputMatchesFileName(userInput, file.name))
                return true
        }

        return false
    }

    getSearchResult(userInput) {
        let result = []

        for (let file of this.files) {
            if (this.userInputMatchesFileName(userInput, file.name))
                result.push(file)
        }

        return result
    }

    execute(filePath) {
        exec(`start "" "${filePath}"`, (err, stdout, sterr) => {
            if (err)
                throw err
            else
                ipcRenderer.send('hide-main-window')
        })
    }

    getFiles() {
        let result = []

        let files = fs.readdirSync(this.homeFolderPath)

        for (let fileName of files) {
            try {
                let filePath = `${this.homeFolderPath}\\${fileName}`
                let stats = fs.lstatSync(filePath)

                if (stats.isSymbolicLink())
                    continue

                let icon = stats.isDirectory()
                    ? `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                            <g id="surface1">
                                <path d="M 6 3 L 6 29 L 26 29 L 26 15.4375 L 27.71875 13.71875 L 28 13.40625 L 28 3 Z M 8 5 L 22 5 L 22 13.40625 L 22.28125 13.71875 L 24 15.4375 L 24 27 L 8 27 Z M 24 5 L 26 5 L 26 12.5625 L 25 13.5625 L 24 12.5625 Z "></path>
                            </g>
                        </svg>`
                    : `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                            <g id="surface1">
                                <path style=" " d="M 6 3 L 6 29 L 26 29 L 26 9.59375 L 25.71875 9.28125 L 19.71875 3.28125 L 19.40625 3 Z M 8 5 L 18 5 L 18 11 L 24 11 L 24 27 L 8 27 Z M 20 6.4375 L 22.5625 9 L 20 9 Z "></path>
                            </g>
                        </svg>`

                if ((stats.isFile() || stats.isDirectory()) && !stats.isSymbolicLink())
                    result.push({
                        name: fileName,
                        execArg: filePath,
                        icon: icon
                    })
            }
            catch (err) {
                console.log(err)
            }
        }

        return result
    }

    userInputMatchesFileName(userInput, fileName) {
        return stringHelpers.stringContainsSubstring(fileName, userInput)
    }
}