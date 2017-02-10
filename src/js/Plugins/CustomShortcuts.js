import path from 'path'
import {exec} from 'child_process'

import ConfigManager from './../ConfigManager'

export default class CustomShortcuts {
    constructor() {
        this.customShortcuts = new ConfigManager().getConfig().customShortcuts
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
}