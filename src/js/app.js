import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { ipcRenderer } from 'electron'
import batteryLevel from 'battery-level'

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
        searchIcon: 'fa fa-search',
        hideExecuteOutput: true,
        hideConfig: true,
        config: configManager.getConfig(),
        colorTheme: configManager.getConfig().colorTheme,
        colorThemePath: `./css/${configManager.getConfig().colorTheme}.css`,
        newFolder: '',
        newCustomShortcut: {},
        newWebSearch: {},
        battery: {},
        computerHasBattery: false,
        dateTimeNow: getDateTime()
    },
    methods: {
        handleKeyPress(e) {
            if (e.key === 'Enter')
                this.execute()

            else if (e.ctrlKey && e.key === 'o')
                this.openFileLocation()

            else if (e.shiftKey && e.key === 'ArrowUp') {
                e.preventDefault()
                this.userInput = historyManager.getPrevious()
            }

            else if (e.shiftKey && e.key === 'ArrowDown') {
                e.preventDefault()
                this.userInput = historyManager.getNext()
            }

            else if (e.key === 'ArrowUp') {
                e.preventDefault()
                this.selectPrevious()
                scrollToActiveItem()
            }

            else if (e.key === 'ArrowDown') {
                e.preventDefault()
                this.selectNext()
                scrollToActiveItem()
            }

            else if (e.key === 'Tab') {
                e.preventDefault();

                let activeItem = {}
                for (let item of this.searchResult)
                    if (item.isActive)
                        activeItem = item

                let autoCompletionResult = this.autoComplete(activeItem)
                this.userInput = autoCompletionResult === undefined
                    ? this.userInput
                    : autoCompletionResult
            }
        },
        autoComplete() { },
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
                let activeItem = Item()
                pluginManager.execute(this.userInput, activeItem.execArg, this.appendExecuteOutput)
                historyManager.addItem(this.userInput)
                this.resetUserInput()
            }
        },
        openFileLocation() {
            if (this.searchResult.length === 0)
                return

            let filePath = Item().execArg

            if (filePath === undefined || !fs.existsSync(filePath))
                return
            else
                exec(`start explorer.exe /select,"${path.win32.normalize(filePath)}"`, (err, stout, sterr) => {
                    if (err) throw err
                })
        },
        addNewFolder() {
            if (stringIsEmptyOrWhitespaces(this.newFolder) || folderIsAlreadyInConfig(this.newFolder))
                return

            if (!fs.existsSync(this.newFolder))
                alert('This file or folder does not exist')
            else {
                this.config.folders.push(this.newFolder)
                this.newFolder = ''
            }
        },
        removeFolder(folder) {
            let folders = []

            for (let item of this.config.folders)
                if (item !== folder)
                    folders.push(item)

            this.config.folders = folders
        },
        addNewCustomShortcut() {
            if (stringIsEmptyOrWhitespaces(this.newCustomShortcut.shortCut)
                || stringIsEmptyOrWhitespaces(this.newCustomShortcut.path)
                || !fs.existsSync(this.newCustomShortcut.path))
                return

            this.config.customShortcuts.push(this.newCustomShortcut)
            this.newCustomShortcut = {}
        },
        removeCustomShortcut(customShortcut) {
            let customShortcuts = []

            for (let item of this.config.customShortcuts)
                if (item.shortCut !== customShortcut.shortCut && item.path !== customShortcut.path)
                    customShortcuts.push(item)

            this.config.customShortcuts = customShortcuts
        },
        removeWebSearch(webSearch) {
            let webSearches = []

            for (let item of this.config.webSearches)
                if (item.name !== webSearch.name
                    && item.prefix !== webSearch.prefix
                    && item.url !== webSearch.url)
                    webSearches.push(item)

            this.config.webSearches = webSearches
        },
        addNewWebSearch() {
            if (stringIsEmptyOrWhitespaces(this.newWebSearch.name)
                || stringIsEmptyOrWhitespaces(this.newWebSearch.prefix)
                || stringIsEmptyOrWhitespaces(this.newWebSearch.url))
                return

            if (webSearchAlreadyExists(this.newWebSearch))
                return
            else
                this.config.webSearches.push(this.newWebSearch)
        },
        cleanUpFavorites() {
            this.config.favorites = []
        },
        closeConfig() {
            this.hideConfig = true
            focusOnInput()
        },
        saveConfig() {
            configManager.setConfig(this.config)
            ipcRenderer.send('reload-window')
        }
    },
    watch: {
        userInput: function (val, oldVal) {
            if (stringIsEmptyOrWhitespaces(val)) {
                this.searchResult = []
                this.searchIcon = 'fa fa-search'
                return
            }

            this.searchResult = pluginManager.getSearchResult(val)
            this.autoComplete = pluginManager.getAutoCompletion(val)
            this.searchIcon = pluginManager.getIcon(val);

            if (this.searchResult.length > 0) {
                for (let i = 0; i < this.searchResult.length; i++)
                    this.searchResult[i].id = `search-result-${i}`

                this.searchResult[0].isActive = true
                this.hideConfig = true
            }

            this.resetExecuteOutput()
        },
        hideConfig: function (val, oldVal) {
            if (!this.hideConfig)
                this.config = configManager.getConfig()
        },
        colorTheme: function (colorTheme, oldColortheme) {
            this.config.colorTheme = colorTheme
            this.colorThemePath = `./css/${colorTheme}.css`
        }
    }
})

function webSearchAlreadyExists(webSearch) {
    for (let item of vue.config.webSearches)
        if (item.name.toLowerCase() === webSearch.name.toLowerCase()
            && item.prefix === webSearch.prefix.toLowerCase()
            && item.url.toLowerCase() === webSearch.url.toLowerCase())
            return true

    return false
}

function folderIsAlreadyInConfig(folder) {
    for (let item of vue.config.folders)
        if (item.toLowerCase() === folder.toLowerCase())
            return true

    return false
}

function Item() {
    for (let item of vue.searchResult)
        if (item.isActive)
            return item
}

function focusOnInput() {
    document.getElementById('user-input').focus()
}

function setBattery() {
    batteryLevel().then(level => {
        if (!isNaN(level))
            vue.computerHasBattery = true

        vue.battery.percentage = Math.round(level * 100)
        vue.battery.icon = getBatteryIcon()
    });
}

function getBatteryIcon() {
    if (vue.battery.percentage >= 80)
        return 'fa fa-battery-full'
    if (vue.battery.percentage >= 60)
        return 'fa fa-battery-three-quarters'
    if (vue.battery.percentage >= 40)
        return 'fa fa-battery-half'
    if (vue.battery.percentage >= 20)
        return 'fa fa-battery-quarter'
    else
        return 'fa fa-battery-empty'
}

function getDateTime() {
    return new Date().toLocaleString('de-CH')
}

function setDateTime() {
    vue.dateTimeNow = getDateTime()
}

function stringIsEmptyOrWhitespaces(string) {
    return string === undefined || string.replace(/\s/g, '').length === 0
}

function getActiveItem() {
    for (let item of vue.searchResult)
        if (item.isActive)
            return item
}

function scrollToActiveItem() {
    let activeItem = document.getElementById(getActiveItem().id)
    activeItem.scrollIntoView()
}

// global key press 'f6' to focus on input
document.addEventListener('keyup', (e) => {
    if (e.key === 'F6')
        focusOnInput()
})

setInterval(() => {
    setBattery()
    setDateTime()
}, 1000)