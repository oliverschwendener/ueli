import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

export default class InstalledPrograms {
    constructor() {
        this.folders = [
            'C:\\ProgramData\\Microsoft\\Windows\\Start Menu',
            `${process.env.HOME}\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu`,
            `${process.env.HOME}\\Desktop`
        ]

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

        for (let program of this.programs)
            if (program.indexOf(userInput) > -1)
                result.push({
                    name: path.basename(program),
                    execArg: program,
                    isActive: false
                })

        if (result.length > 0)
            result[0].isActive = true

        return result
    }

    execute(filePath) {
        let args = `start "" "${filePath}"`

        exec(args, (err, stdout, sterr) => {
            if (err) throw err
        })
    }
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