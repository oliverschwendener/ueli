import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { ipcRenderer } from 'electron'
import levenshtein from 'fast-levenshtein'
import ConfigManager from './../ConfigManager'
import FavoritesManager from './../FavoritesManager'

export default class InstalledPrograms {
    constructor() {
        this.folders = new ConfigManager().getConfig().folders
        this.favorites = new FavoritesManager().getFavorites()
        this.programs = getFilesFromDirectoriesRecursivelyByFileExtension(this.folders)
        this.initalizeFileWatchers()
    }

    initalizeFileWatchers() {
        setInterval(() => {
            this.programs = getFilesFromDirectoriesRecursivelyByFileExtension(this.folders)
        }, 10000)
    }

    isValid(userInput) {
        this.searchResult = this.search(userInput)
        return this.searchResult.length > 0
    }

    search(userInput) {
        let result = []

        // add programs with weight
        for (let program of this.programs) {
            let programName = path.basename(program).replace('.lnk', '')
            if (stringContainsSubstring(programName, userInput)) {
                let weight = getWeight(programName, userInput)
                if (weight > 0)
                    result.push({
                        name: programName,
                        execArg: program,
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
                        item.weight = item.weight - (favorite.counter * 2)

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
        let args = `start "" "${filePath}"`

        exec(args, (err, stdout, sterr) => {
            if (err)
                throw err
            else {
                new FavoritesManager().addFavorite(filePath)
                ipcRenderer.send('hide-main-window')
            }
        })
    }
}

function stringContainsSubstring(stringToSearch, substring) {
    let wordsOfSubstring = splitStringToArray(substring.toLowerCase())
    stringToSearch = stringToSearch.split(' ').join('').toLowerCase()

    for (let word of wordsOfSubstring) {
        if (word.replace(' ', '') === '')
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
            let levenshteinDistance = levenshtein.get(word, value)
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

function getFilesFromDirectoriesRecursivelyByFileExtension(directories, fileExtension = '*') {
    let result = [];

    for (let directory of directories) {
        let dir = directory;
        try {
            let files = fs.readdirSync(dir);
            for (let file of files) {
                file = `${dir}/${file}`;
                let stat = fs.lstatSync(file);
                if (stat && stat.isDirectory() && !stat.isSymbolicLink()) {
                    try {
                        result = result.concat(getFilesFromDirectoriesRecursivelyByFileExtension([file], fileExtension));
                    }
                    catch (err) {
                        throw err;
                    }
                }
                else {
                    if (fileExtension === '*')
                        result.push(file);
                    else if (path.extname(file).toLowerCase() === fileExtension.toLowerCase())
                        result.push(file);
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return result;
}