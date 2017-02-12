import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import levenshtein from 'fast-levenshtein'

export default class FileBrowser {
    isValid(filePath) {
        let regex = new RegExp(/[a-z]:[\\/]/ig)
        return regex.test(filePath) && (fs.existsSync(filePath) || fs.existsSync(path.dirname(filePath)))
    }

    execute(filePath) {
        exec(`start "" "${filePath}"`, (err, stdout, sterr) => {
            if (err)
                throw err
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
                    isActive: false
                }]
            }
        }
        else if (fs.existsSync(path.dirname(userInput))) {
            return getResultFromDirectory(path.dirname(userInput), userInput)
        }
    }
}

function getResultFromDirectory(folderPath, userInput) {
    let files = fs.readdirSync(folderPath)
    let result = []
    for (let file of files)
        result.push({
            name: path.basename(file),
            execArg: path.win32.normalize(`${folderPath}\\${file}`),
            weight: levenshtein.get(path.basename(file), userInput),
            isActive: false
        })

    let sortedResult = result.sort((a, b) => {
        if (a.weight > b.weight) return 1
        if (a.weight < b.weight) return -1
        return 0
    })
    
    return sortedResult
}