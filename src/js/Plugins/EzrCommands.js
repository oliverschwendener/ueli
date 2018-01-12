import { exec } from 'child_process'
import { ipcRenderer } from 'electron'
import open from 'open'

import ConfigManager from './../ConfigManager'

let commandPrefix = 'ezr'

export default class EzrCommands {
    constructor() {
        this.name = 'Ezr Commands'
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
                description: 'Reset configuration to default values',
                execute() {
                    new ConfigManager().resetConfigToDefault()
                    ipcRenderer.send('reload-window')
                }
            },
            {
                command: `${commandPrefix}:docs`,
                description: 'Read the documentation',
                execute() {
                    open('https://github.com/oliverschwendener/electronizr#electronizr')
                }
            },
            {
                command: `${commandPrefix}:about`,
                description: 'About electronizr',
                execute() {
                    ipcRenderer.send('get-info')
                }
            }
        ]
        this.icon = 'fa fa-angle-right'
    }

    getName() {
        return this.name
    }

    isValid(userInput) {
        return userInput.toLowerCase().startsWith(`${commandPrefix}:`)
    }

    execute(execArg) {
        for (let command of this.commands)
            if (command.command === execArg)
                command.execute()
    }

    getSearchResult(userInput) {
        let result = []

        for (let command of this.commands) {
            result.push({
                name: command.description,
                execArg: command.command,
            })
        }

        return result
    }

    getIcon() {
        return this.icon
    }
}