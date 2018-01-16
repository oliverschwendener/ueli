import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { ipcRenderer } from 'electron'
import ConfigManager from './../ConfigManager'
import StringHelpers from './../Helpers/StringHelpers'

let stringHelpers = new StringHelpers()

export default class InstalledPrograms {
    constructor() {
        this.config = new ConfigManager().getConfig()
        this.name = 'Installed Programs'
        this.folders = this.config.folders
        this.programs = []
        this.setup()
        this.initalizeFileWatchers()

        this.icon = `<svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                        <g id="surface1">
                            <path style=" " d="M 4 4 L 4 28 L 28 28 L 28 4 Z M 6 6 L 26 6 L 26 10 L 6 10 Z M 7 7 L 7 9 L 9 9 L 9 7 Z M 10 7 L 10 9 L 12 9 L 12 7 Z M 13 7 L 13 9 L 15 9 L 15 7 Z M 6 12 L 26 12 L 26 26 L 6 26 Z "></path>
                        </g>
                    </svg>`

        this.shorcutFileExtensions = [
            '.lnk',
            '.appref-ms',
            '.url'
        ]
    }

    getName() {
        return this.name
    }

    async setup() {
        await this.getFilesFromDirectoriesRecursivelyByFileExtension(this.folders)
    }

    initalizeFileWatchers() {
        setInterval(async () => {
            this.programs = []
            await this.getFilesFromDirectoriesRecursivelyByFileExtension(this.folders)
        }, convertSecondsToMilliSeconds(this.config.rescanInterval))
    }

    isValid(userInput) {
        this.searchResult = this.search(userInput)
        return this.searchResult.length > 0 || this.searchResultContainsFilePath(userInput)
    }

    search(userInput) {
        let result = []

        for (let program of this.programs) {
            let programName = path.basename(program)

            for (let shortCutFileExtension of this.shorcutFileExtensions)
                programName = programName.replace(shortCutFileExtension, '')

            if (stringHelpers.stringContainsSubstring(programName, userInput)) {
                result.push({
                    name: programName,
                    execArg: path.win32.normalize(program),
                    icon: this.icon
                })
            }
        }

        return result
    }

    getSearchResult(userInput) {
        return this.searchResult
    }

    execute(filePath) {
        let args = `start "" "${filePath}"`

        exec(args, (err, stdout, sterr) => {
            if (err)
                throw err
            else {
                ipcRenderer.send('hide-main-window')
            }
        })
    }

    searchResultContainsFilePath(filePath) {
        for (let item of this.programs)
            if (path.win32.normalize(item) === path.win32.normalize(filePath))
                return true

        return false
    }

    async getFilesFromDirectoriesRecursivelyByFileExtension(directories, fileExtension = '*') {
        let result = []

        let filePromises = await directories.map(async d => await this.getFilesFromDirecotry(d, fileExtension))
        await Promise.all(filePromises).then(results => result.push(...([].concat(...results))))

        this.programs.push(...result)
    }

    async getFilesFromDirecotry(directory, fileExtension) {
        const self = this
        return new Promise(function (resolve, reject) {
            fs.readdir(directory, async (error, files) => {
                if (error) {
                    reject(error);
                } else {
                    let results = []
                    let filesWithExpandedPath = files.map(f => `${directory}/${f}`)
                    filesWithExpandedPath.forEach(async file => {
                        // Skip hidden files
                        if (path.basename(file).startsWith('.')) {
                            return
                        }

                        // Skip desktop.ini files
                        if (path.basename(file).toLowerCase() === 'desktop.ini') {
                            return
                        }

                        const stat = fs.lstatSync(file)
                        if (stat && stat.isDirectory() && !stat.isSymbolicLink()) {
                            self.getFilesFromDirectoriesRecursivelyByFileExtension([file], fileExtension)
                        }
                        else {
                            if (fileExtension === '*') {
                                results.push(file)
                            }
                            else if (path.extname(file).toLowerCase() === fileExtension.toLowerCase()) {
                                results.push(file)
                            }
                        }
                    })
                    resolve(results);
                }
            })
        })
    }
}

function convertSecondsToMilliSeconds(seconds) {
    return seconds * 1000
}
