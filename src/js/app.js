import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { ipcRenderer } from 'electron'

import ConfigManager from './js/ConfigManager'
import PluginManager from './js/PluginManager'
import HistoryManager from './js/HistoryManager'

let configManager = new ConfigManager()
let pluginManager = new PluginManager()
let historyManager = new HistoryManager()

let vue = new Vue({
    el: '#root',
    data: {
        userInput: '',
        focusOnInput: true,
        searchResult: [],
        executeOutput: '',
        hideExecuteOutput: true,
        hideConfig: true,
        colorTheme: configManager.getConfig().colorTheme,
        colorThemePath: `./css/${configManager.getConfig().colorTheme}.css`
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

            else if (e.key === 'ArrowUp') {
                e.preventDefault()
                this.userInput = historyManager.getPrevious()
            }

            else if (e.key === 'ArrowDown') {
                e.preventDefault()
                this.userInput = historyManager.getNext()
            }
        },
        selectNext() {
            console.log(this.searchResult)
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
        resetUserInput() {
            this.userInput = ''
        },
        appendExecuteOutput(output) {
            this.executeOutput += output
            this.hideExecuteOutput = false
        },
        resetExecuteOutput() {
            this.executeOutput = ''
            this.hideExecuteOutput = true
        },
        execute() {
            this.resetExecuteOutput()

            if (this.searchResult.length > 0) {
                for (let item of this.searchResult)
                    if (item.isActive) {
                        pluginManager.execute(this.userInput, item.execArg, this.appendExecuteOutput)
                        historyManager.addItem(this.userInput)
                    }

                this.resetUserInput()
            }
        },
        openFileLocation() {
            if (this.searchResult.length === 0)
                return

            let filePath = ''

            for (let item of this.searchResult)
                if (item.isActive)
                    filePath = item.execArg

            if (filePath === undefined || !fs.existsSync(filePath))
                return
            else
                exec(`start explorer.exe /select,"${path.win32.normalize(filePath)}"`, (err, stout, sterr) => {
                    if (err) throw err
                })
        }
    },
    watch: {
        userInput: function (val, oldVal) {
            if (val.replace(/\s/g, '').length === 0) {
                this.searchResult = []
                return
            }

            this.searchResult = pluginManager.getSearchResult(val)

            if (this.searchResult.length > 0) {
                this.searchResult[0].isActive = true
                this.hideConfig = true
            }

            this.resetExecuteOutput()
        },
        colorTheme: function (val, oldVal) {
            this.colorThemePath = `./css/${this.colorTheme}.css`

            let config = configManager.getConfig()
            config.colorTheme = this.colorTheme
            configManager.setConfig(config)
        }
    }
})

ipcRenderer.on('show-config', () => {
    vue.hideConfig = false
})