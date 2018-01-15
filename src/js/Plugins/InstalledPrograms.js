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
        this.icon = 'fa fa-window-maximize'
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
