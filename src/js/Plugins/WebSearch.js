import ConfigManager from './../ConfigManager'
import { ipcRenderer } from 'electron'
import ExecutionService from './../ExecutionService'

let executionService = new ExecutionService()

export default class WebSearch {
    constructor() {
        this.name = 'Web Search'
        this.webSearches = new ConfigManager().getConfig().webSearches
        this.separator = '?'
    }

    getName() {
        return this.name
    }

    isValid(userInput) {
        let webSearch = this.getValidWebSearch(userInput)
        return webSearch !== undefined
    }

    execute(url) {
        executionService.openDefaultBrowser(url)
        ipcRenderer.send('hide-main-window')
    }

    getSearchResult(userInput) {
        let webSearch = this.getValidWebSearch(userInput)
        userInput = userInput.replace(`${webSearch.prefix}${this.separator}`, '')
        userInput = encodeURIComponent(userInput)
        return [{
            name: `${webSearch.name} search`,
            execArg: `${webSearch.url}${userInput}`,
            icon: webSearch.icon
        }]
    }

    getValidWebSearch(userInput) {
        for (let search of this.webSearches)
            if (userInput.startsWith(`${search.prefix}${this.separator}`))
                return search
    }
}