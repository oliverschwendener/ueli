import path from 'path'
import { exec } from 'child_process'
import { ipcRenderer } from 'electron'

import ConfigManager from './../ConfigManager'

export default class CustomShortcuts {
    constructor() {
        this.customShortcuts = new ConfigManager().getConfig().customShortcuts
        this.icon = 'fa fa-window-maximize'
    }

    isValid(userInput) {
        for (let customShortcut of this.customShortcuts)
            if (customShortcut.shortCut === userInput)
                return true

        return false
    }

    execute(execArg, userInput) {
        exec(`start "" "${execArg}"`, (err, stout, sterr) => {
            if (err)
                throw err
            else
                ipcRenderer.send('hide-main-window')
        })
    }

    getSearchResult(userInput) {
        for (let customShortcut of this.customShortcuts)
            if (customShortcut.shortCut === userInput)
                return [{
                    name: path.basename(customShortcut.path).replace('.lnk', ''),
                    execArg: customShortcut.path
                }]
    }

    getIcon(userInput) {
        return this.icon
    }
}