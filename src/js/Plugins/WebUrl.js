import open from 'open'
import { ipcRenderer } from 'electron'

import ConfigManager from './../ConfigManager'
let configManager = new ConfigManager()

export default class WebUrl {
    constructor() {
        this.icon = 'fa fa-globe'
        this.name = 'Web URL'
    }

    getName() {
        return this.name
    }

    isValid(url) {
        let expression = /^((https?:)?[/]{2})?([a-z0-9]+[.])+[a-z]+.*$/i
        let regex = new RegExp(expression)

        if (url.match(regex))
            return true

        return false
    }

    execute(url) {
        url = addHttpToUrl(url)
        open(url)
        ipcRenderer.send('hide-main-window')
    }

    getSearchResult(userInput) {
        return [{
            name: `Open in browser`,
            execArg: addHttpToUrl(userInput)
        }]
    }

    getIcon(userInput) {
        return this.icon
    }
}

function addHttpToUrl(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('//'))
        url = `http://${url}`

    return url
}