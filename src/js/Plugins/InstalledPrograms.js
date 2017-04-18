import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { ipcRenderer } from 'electron'
import leven from 'leven'
import ConfigManager from './../ConfigManager'
import FavoritesManager from './../FavoritesManager'

export default class InstalledPrograms {
    constructor() {
        this.folders = new ConfigManager().getConfig().folders
        this.favorites = new FavoritesManager().getFavorites()
        this.programs = []
        this.setup()
        this.initalizeFileWatchers()
        this.icon = 'fa fa-window-maximize'
    }

    async setup() {
        await this.getFilesFromDirectoriesRecursivelyByFileExtension(this.folders)
    }

    initalizeFileWatchers() {
        setInterval(async () => {
            this.programs = []
            await this.getFilesFromDirectoriesRecursivelyByFileExtension(this.folders)
            this.favorites = new FavoritesManager().getFavorites()
        }, 10000)
    }

    isValid(userInput) {
        this.searchResult = this.search(userInput)
        return this.searchResult.length > 0 || this.searchResultContainsFilePath(userInput)
    }

    search(userInput) {
        let result = []

        // add programs with weight
        for (let program of this.programs) {
            let programName = path.basename(program).replace('.lnk', '')
            if (stringContainsSubstring(programName, userInput)) {
                let weight = getWeight(programName, userInput)
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

function stringContainsSubstring(stringToSearch, substring) {
    let wordsOfSubstring = splitStringToArray(substring.toLowerCase())
    stringToSearch = stringToSearch.split(' ').join('').toLowerCase()

    for (let word of wordsOfSubstring) {
        if (stringIsEmptyOrWhitespaces(word))
            continue
        else if (stringToSearch.indexOf(word) === -1)
            return false
    }

    return true
}

function getWeight(programNameWithExtension, userInput) {
    let results = []
    let stringToSearchWords = splitStringToArray(programNameWithExtension)
    let valueWords = splitStringToArray(userInput)

    for (let word of stringToSearchWords)
        for (let value of valueWords) {
            let levenshteinDistance = leven(word, value)
            let result = word.startsWith(value)
                ? (levenshteinDistance / 4)
                : levenshteinDistance

            results.push(result)
        }

    return getAvg(results)
}

function getAvg(numbers) {
    let sum = 0

    for (let value of numbers)
        sum = sum + value

    return sum / numbers.length
}

function stringIsEmptyOrWhitespaces(string) {
    return string === undefined || string.replace(/\s/g, '').length === 0
}

function splitStringToArray(string) {
    return string.split(/\s+/)
}

