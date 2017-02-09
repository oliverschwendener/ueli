import path from 'path'

import PluginManager from './js/PluginManager'
let pluginManager = new PluginManager()

let vue = new Vue({
    el: '#root',
    data: {
        userInput: '',
        focusOnInput: true,
        searchResult: [],
        theme: 'osc-dark-blue',
        themePath: './css/osc-dark-blue.css'
    },
    methods: {
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
            alert('Executing')
        },
        openFileLocation() {
            alert('Open file location')
        }
    },
    watch: {
        userInput: function (val, oldVal) {
            this.searchResult = pluginManager.getSearchResult(val)
        },
        theme: function(val, oldVal) {
            this.themePath = `./css/${this.theme}.css`
        }
    }
})

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