import open from 'open'
import { ipcRenderer } from 'electron'

import ConfigManager from './../ConfigManager'
let configManager = new ConfigManager()

export default class WebUrl {
    constructor() {
        this.icon = 'fa fa-globe'
    }

    isValid(url) {
        if (url.endsWith('.exe'))
            return false

        let expression = /^[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?$/gi
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
            name: `Open default web browser`,
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