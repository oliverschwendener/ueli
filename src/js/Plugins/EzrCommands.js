import levenshtein from 'fast-levenshtein'
import { exec } from 'child_process'
import { ipcRenderer } from 'electron'

import ConfigManager from './../ConfigManager'

let commandPrefix = 'ezr'

export default class EzrCommands {
    constructor() {
        this.commands = [
            {
                command: `${commandPrefix}:config`,
                description: 'Edit configuration',
                execute() {
                    vue.hideConfig = false
                }
            },
            {
                command: `${commandPrefix}:reload`,
                description: 'Reload electronizr',
                execute() {
                    ipcRenderer.send('reload-window')
                }
            },
            {
                command: `${commandPrefix}:exit`,
                description: 'Exit electronizr',
                execute() {
                    ipcRenderer.send('close-main-window')
                }
            },
            {
                command: `${commandPrefix}:reset`,
                description: 'Reset electronizr configuration to default',
                execute() {
                    new ConfigManager().resetConfigToDefault()
                    ipcRenderer.send('reload-window')
                }
            }
        ]
    }

    isValid(userInput) {
        return userInput.startsWith(commandPrefix)
    }

    execute(execArg) {
        for (let command of this.commands)
            if (command.command === execArg)
                command.execute()
    }

    getSearchResult(userInput) {
        let result = []

        for (let command of this.commands) {
            let weight = levenshtein.get(command.command, userInput)
            result.push({
                name: command.description,
                execArg: command.command,
                isActive: false,
                weight: weight
            })
        }

        let sortedResult = result.sort((a, b) => {
            if (a.weight > b.weight) return 1
            if (a.weight < b.weight) return -1
            return 0
        })

        return sortedResult
    }
}