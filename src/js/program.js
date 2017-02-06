import fs from 'fs'
import path from 'path'

import ExecutionService from './js/ExecutionService'

let vue = new Vue({
    el: '#root',
    data: {
        userInput: '',
        focusOnInput: true,
        elements: [],
        searchResult: []
    },
    methods: {
        init() {
            getFilesRecursively('C:\\ProgramData\\Microsoft\\Windows\\Start Menu', this.appendToElements)
            getFilesRecursively(`C:\\Users\\Oliver\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu`, this.appendToElements)
        },
        appendToElements(data) {
            this.elements.push(data)
        },
        handleKeyPress(e) {
            if (e.key === 'Enter')
                this.execute()

            else if (e.ctrlKey && e.key === 'o')
                this.openFileLocation()                

            else if (e.shiftKey && e.key === 'Tab') {
                e.preventDefault()
                this.selectPrevious()
            }

            else if (e.key === 'Tab') {
                e.preventDefault();
                this.selectNext()
            }
        },
        selectNext() {
            let iterator = 0
            let maxIndex = this.searchResult.length - 1
            for (let item of this.searchResult) {
                if (item.isActive) {
                    if (iterator === maxIndex) {
                        this.selectFirst()
                        return
                    }

                    item.isActive = false
                    this.searchResult[iterator + 1].isActive = true
                    console.log(this.searchResult[iterator + 1])
                    break
                }
                iterator++
            }
        },
        selectPrevious() {
            let iterator = 0
            for (let item of this.searchResult) {
                if (item.isActive) {
                    if (iterator === 0) {
                        this.selectLast()
                        return
                    }

                    item.isActive = false
                    this.searchResult[iterator - 1].isActive = true
                    break
                }
                iterator++
            }
        },
        selectFirst() {
            for (let item of this.searchResult)
                item.isActive = false

            this.searchResult[0].isActive = true
        },
        selectLast() {
            for (let item of this.searchResult)
                item.isActive = false

            let lastIndex = this.searchResult.length - 1
            this.searchResult[lastIndex].isActive = true
        },
        resetUserInput () {
            this.userInput = ''
        },
        execute() {
            for (let item of this.searchResult)
                if (item.isActive) {
                    new ExecutionService().execute(item.execArgs)
                    this.resetUserInput()
                }
        },
        openFileLocation() {
            for (let item of this.searchResult)
                if (item.isActive)
                    new ExecutionService().openFileLocation(item.execArgs)
        }
    },
    watch: {
        // Fire when user input changes
        userInput: function (val, oldVal) {
            // return if userinput is empty or only whitespace
            if (this.userInput.replace(' ', '').length === 0) {
                this.searchResult = []
                return
            }

            // get searchResult
            let result = []

            for (let element of this.elements) {
                let appName = path.basename(element).replace('.lnk', '')
                let weigth = getWeight(appName, this.userInput)

                if (weigth > 0) {
                    result.push({
                        name: appName,
                        weight: weigth,
                        execArgs: element,
                        isActive: false
                    })
                }
            }

            // Sort search result
            let sortedResult = result.sort((a, b) => {
                if (a.weight < b.weight) return 1
                else if (a.weight > b.weight) return -1
                else return 0
            })

            // Set first item to be active
            if (sortedResult.length > 0)
                sortedResult[0].isActive = true

            this.searchResult = sortedResult
        }
    }
})

vue.init()

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

function getWeight(string, substring) {
    let weight = 0
    let strings = string.split(' ')
    let substrings = substring.split(' ')

    for (let word of strings) {
        if (word.length === 0)
            continue

        for (let word2 of substrings) {
            if (word2.length === 0)
                continue
            else if (word.toLowerCase().indexOf(word2.toLowerCase()) > -1)
                weight++
        }
    }

    return weight
}