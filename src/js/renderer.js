import fs from 'fs'
import path from 'path'
import {
    exec
} from 'child_process'
import {
    ipcRenderer
} from 'electron'

import ConfigManager from './js/ConfigManager'
import PluginManager from './js/PluginManager'
import HistoryManager from './js/HistoryManager'
import ExecutionService from './js/ExecutionService'
import {
    version
} from 'punycode';

let packageJson = require('./package.json')
let configManager = new ConfigManager()
let pluginManager = new PluginManager()
let historyManager = new HistoryManager()

// Initalize Vue
let vue = new Vue({
    el: '#root',
    data: {
        userInput: '',
        focusOnInput: true,
        searchResult: [],
        executeOutput: '',
        hideExecuteOutput: true,
        filePreview: '',
        hideFilePreview: true,
        hideConfig: true,
        config: configManager.getConfig(),
        colorTheme: configManager.getConfig().colorTheme,
        colorThemePath: `./css/${configManager.getConfig().colorTheme}.css`,
        newFolder: '',
        newCustomShortcut: {},
        newWebSearch: {}
    },
    methods: {
        handleKeyPress(e) {
            if (e.key === 'Enter')
                this.execute()

            else if (e.ctrlKey && e.key === 'o')
                this.openFileLocation()

            else if (e.ctrlKey && e.code === 'Space')
                this.getFilePreview()

            else if (e.shiftKey && e.key === 'ArrowUp') {
                e.preventDefault()
                this.userInput = historyManager.getPrevious()
            } else if (e.shiftKey && e.key === 'ArrowDown') {
                e.preventDefault()
                this.userInput = historyManager.getNext()
            } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                this.selectPrevious()
                scrollToActiveItem()
            } else if (e.key === 'ArrowDown') {
                e.preventDefault()
                this.selectNext()
                scrollToActiveItem()
            } else if (e.key === 'Tab') {
                e.preventDefault()
                this.autoComplete()
            }
        },
        autoComplete() {
            let activeItem = {}
            for (let item of this.searchResult)
                if (item.isActive)
                    activeItem = item

            this.userInput = pluginManager.getAutoCompletionResult(activeItem)
        },
        search() {
            if (stringIsEmptyOrWhitespaces(this.userInput)) {
                this.searchResult = []
                return
            }

            this.searchResult = pluginManager.getSearchResult(this.userInput)

            if (this.searchResult.length > 0) {
                for (let i = 0; i < this.searchResult.length; i++)
                    this.searchResult[i].id = `search-result-${i}`

                this.searchResult[0].isActive = true
                this.hideConfig = true
            }

            scrollToActiveItem()

            this.resetExecuteOutput()
            this.resetFilePreview()
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
            this.resetFilePreview()
            if (this.searchResult.length > 0) {
                let activeItem = getActiveItem()
                historyManager.addItem(this.userInput)
                this.resetUserInput()
                setTimeout(() => {
                    pluginManager.execute(activeItem.execArg, this.appendExecuteOutput)
                }, 20)
            }
        },
        openFileLocation() {
            if (this.searchResult.length === 0)
                return

            let filePath = getActiveItem().execArg
            new ExecutionService().openFileLocation(filePath)
        },
        getFilePreview() {
            if (!this.hideFilePreview) {
                this.search()
                return
            }

            if (this.searchResult.length === 0)
                return

            let filePath = getActiveItem().execArg
            this.filePreview = new ExecutionService().getFilePreview(filePath)

            if (this.filePreview === undefined)
                return

            this.searchResult = []
            this.hideFilePreview = false
        },
        resetFilePreview() {
            this.filePreview = ''
            this.hideFilePreview = true
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
            if (stringIsEmptyOrWhitespaces(this.newCustomShortcut.shortCut) ||
                stringIsEmptyOrWhitespaces(this.newCustomShortcut.execArg))
                return

            this.config.customShortcuts.push(this.newCustomShortcut)
            this.newCustomShortcut = {}
        },
        removeCustomShortcut(customShortcut) {
            let customShortcuts = []

            for (let item of this.config.customShortcuts)
                if (item.shortCut !== customShortcut.shortCut && item.execArg !== customShortcut.execArg)
                    customShortcuts.push(item)

            this.config.customShortcuts = customShortcuts
        },
        removeWebSearch(webSearch) {
            let webSearches = []

            for (let item of this.config.webSearches)
                if (item.name !== webSearch.name &&
                    item.prefix !== webSearch.prefix &&
                    item.url !== webSearch.url)
                    webSearches.push(item)

            this.config.webSearches = webSearches
        },
        addNewWebSearch() {
            if (stringIsEmptyOrWhitespaces(this.newWebSearch.name) ||
                stringIsEmptyOrWhitespaces(this.newWebSearch.prefix) ||
                stringIsEmptyOrWhitespaces(this.newWebSearch.url))
                return

            if (webSearchAlreadyExists(this.newWebSearch))
                return
            else
                this.config.webSearches.push(this.newWebSearch)

            this.newWebSearch = {}
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
        },
        showInfo(info) {
            this.filePreview = `<pre>electornizr: ${info.electronizr}<br>node: ${info.node}<br>electron: ${info.electron}<br>v8: ${info.v8}<br>chrome: ${info.chrome}</pre>`
            this.hideFilePreview = false
        }
    },
    watch: {
        userInput: function (val, oldVal) {
            this.search(val)
        },
        hideConfig: function (val, oldVal) {
            this.config = new ConfigManager().getConfig()
        },
        colorTheme: function (colorTheme, oldColortheme) {
            this.config.colorTheme = colorTheme
            this.colorThemePath = `./css/${colorTheme}.css`
        }
    }
})

function webSearchAlreadyExists(webSearch) {
    for (let item of vue.config.webSearches)
        if (item.name.toLowerCase() === webSearch.name.toLowerCase() &&
            item.prefix === webSearch.prefix.toLowerCase() &&
            item.url.toLowerCase() === webSearch.url.toLowerCase())
            return true

    return false
}

function folderIsAlreadyInConfig(folder) {
    for (let item of vue.config.folders)
        if (item.toLowerCase() === folder.toLowerCase())
            return true

    return false
}

function getActiveItem() {
    for (let item of vue.searchResult)
        if (item.isActive)
            return item
}

function focusOnInput() {
    document.getElementById('user-input').focus()
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
    let activeItem = getActiveItem()
    if (activeItem !== undefined && activeItem !== null) {
        let element = document.getElementById(activeItem.id)
        if (element !== undefined && element !== null)
            element.scrollIntoView()
    }
}

// global key press 'f6' to focus on input
document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
        vue.resetUserInput()
        ipcRenderer.send('hide-main-window')
    } else if (e.key === 'F6' || (e.key === 'l' && e.ctrlKey))
        focusOnInput()
})

ipcRenderer.on('get-info', (event, arg) => {
    vue.showInfo({
        electronizr: packageJson.version,
        node: process.versions.node,
        v8: process.versions.v8,
        electron: process.versions.electron,
        chrome: process.versions.chrome
    })
})