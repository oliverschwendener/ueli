import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

import ConfigManager from './js/ConfigManager'
import PluginManager from './js/PluginManager'

let pluginManager = new PluginManager()
let configManager = new ConfigManager()

let vue = new Vue({
    el: '#root',
    data: {
        userInput: '',
        focusOnInput: true,
        searchResult: [],
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
        resetUserInput() {
            this.userInput = ''
        },
        execute() {
            if (this.searchResult.length > 0) {
                for (let item of this.searchResult)
                    if (item.isActive)
                        pluginManager.execute(this.userInput, item.execArg)
                
                this.resetUserInput()
            }
        },
        openFileLocation() {
            if (this.searchResult.length === 0)
                return

            let filePath = this.searchResult[0].execArg

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
            this.searchResult = pluginManager.getSearchResult(val)

            if (this.searchResult.length > 0)
                this.searchResult[0].isActive = true
        },
        colorTheme: function (val, oldVal) {
            this.colorThemePath = `./css/${this.colorTheme}.css`

            let config = configManager.getConfig()
            config.colorTheme = this.colorTheme
            configManager.setConfig(config)
        }
    }
})