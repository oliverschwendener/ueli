import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { ipcRenderer } from 'electron'
import ConfigManager from './../ConfigManager'
import FavoritesManager from './../FavoritesManager'
import StringHelpers from './../Helpers/StringHelpers'

let stringHelpers = new StringHelpers()

export default class InstalledPrograms {
    constructor() {
        this.config = new ConfigManager().getConfig()
        this.folders = this.config.folders
        this.favorites = new FavoritesManager().getFavorites()
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

    async setup() {
        await this.getFilesFromDirectoriesRecursivelyByFileExtension(this.folders)
    }

    initalizeFileWatchers() {
        setInterval(async () => {
            this.programs = []
            await this.getFilesFromDirectoriesRecursivelyByFileExtension(this.folders)
            this.favorites = new FavoritesManager().getFavorites()
        }, convertSecondsToMilliSeconds(this.config.rescanInterval))
    }

    isValid(userInput) {
        this.searchResult = this.search(userInput)
        return this.searchResult.length > 0 || this.searchResultContainsFilePath(userInput)
    }

    search(userInput) {
        let result = []

        // add programs with weight
        for (let program of this.programs) {
            let programName = path.basename(program)

            for (let shortCutFileExtension of this.shorcutFileExtensions)
                programName = programName.replace(shortCutFileExtension, '')

            if (stringHelpers.stringContainsSubstring(programName, userInput)) {
                let weight = stringHelpers.getWeight(programName, userInput)
                if (weight >= 0)
                    result.push({
                        name: programName,
                        execArg: path.win32.normalize(program),
                        weight: weight,
                        isActive: false
                    })
            }
        }

        // list favorite item higher
        if (this.favorites.length > 0)
            for (let item of result)
                for (let favorite of this.favorites)
                    if (favorite.path === item.execArg)
                        item.weight = item.weight - (favorite.counter)

        // sort desc result by weigth
        let sortedResult = result.sort((a, b) => {
            if (a.weight > b.weight) return 1
            if (a.weight < b.weight) return -1
            return 0
        })

        return sortedResult
    }

    getSearchResult(userInput) {
        return this.searchResult
    }

    execute(filePath) {
        new FavoritesManager().addFavorite(filePath)
        let args = `start "" "${filePath}"`

        exec(args, (err, stdout, sterr) => {
            if (err)
                throw err
            else {
                ipcRenderer.send('hide-main-window')
            }
        })
    }

    getAutoCompletion(activeItem) {
        return activeItem.name
    }

    getIcon(userInput) {
        return this.icon
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
