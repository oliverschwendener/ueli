import open from 'open'
import ConfigManager from './../ConfigManager'
import { ipcRenderer } from 'electron'

export default class WebSearch {
    constructor() {
        this.webSearches = new ConfigManager().getConfig().webSearches
        this.separator = '?'
    }

    isValid(userInput) {
        for (let search of this.webSearches)
            if (userInput.startsWith(`${search.prefix}${this.separator}`))
                return true

        return false
    }

    execute(url) {
        open(url)
        ipcRenderer.send('hide-main-window')
    }

    getSearchResult(userInput) {
        for (let search of this.webSearches)
            if (userInput.startsWith(`${search.prefix}${this.separator}`)) {
                userInput = userInput.replace(`${search.prefix}${this.separator}`, '')
                userInput = encodeURIComponent(userInput)
                return [{
                    name: `${search.name} search`,
                    execArg: `${search.url}${userInput}`
                }]
            }
    }
}