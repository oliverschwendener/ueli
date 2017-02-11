import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import levenshtein from 'fast-levenshtein'
import ConfigManager from './../ConfigManager'
import Favorites from './Favorites'

export default class InstalledPrograms {
    constructor() {
        this.folders = new ConfigManager().getConfig().folders
        this.favorites = new Favorites().getFavorites()

        this.programs = []

        this.appendToPrograms = (file) => {
            this.programs.push(file)
        }

        for (let folder of this.folders)
            getFilesRecursively(folder, this.appendToPrograms)
    }

    isValid(userInput) {
        let regex = new RegExp(/^([a-z0-9\ ])+$/, 'igm')
        return regex.test(userInput)
    }

    getSearchResult(userInput) {
        let result = []

        // add programs with weight
        for (let program of this.programs) {
            if (stringContainsSubstring(program, userInput)) {
                let weight = getWeight(program, userInput)
                if (weight > 0)
                    result.push({
                        name: path.basename(program).replace('.lnk', ''),
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

    execute(filePath) {
        let args = `start "" "${filePath}"`

        exec(args, (err, stdout, sterr) => {
            if (err)
                throw err
            else {
                new Favorites().addFavorite(filePath)
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
    return (/^\s+$/.test(string))
}

function splitStringToArray(string) {
    return string.split(/\s+/)
}

function getFilesRecursively(folder, success) {
    fs.readdir(folder, (err, data) => {
        if (err) throw err

        for (let file of data) {
            file = `${folder}/${file}`

            fs.lstat(file, (err, stats) => {
                if (err) throw err

                if (stats.isDirectory() && !stats.isSymbolicLink())
                    getFilesRecursively(file, success)
                else if (stats.isFile())
                    success(file)
            })
        }
    })
}