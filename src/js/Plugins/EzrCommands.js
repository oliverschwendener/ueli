import { exec } from 'child_process'
import { ipcRenderer } from 'electron'
import open from 'open'

import ConfigManager from './../ConfigManager'
import StringHelpers from './../Helpers/StringHelpers'

let commandPrefix = 'ezr'
let stringHelpers = new StringHelpers()

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

        this.icon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                        <g id="surface1">
                            <path style=" " d="M 12.96875 4.28125 L 11.53125 5.71875 L 21.8125 16 L 11.53125 26.28125 L 12.96875 27.71875 L 23.96875 16.71875 L 24.65625 16 L 23.96875 15.28125 Z "></path>
                        </g>
                    </svg>`
    }

    getName() {
        return this.name
    }

    isValid(userInput) {
        for (let command of this.commands)
            if (this.commandMatchesUserInput(command, userInput))
                return true

        return false
    }

    execute(execArg) {
        for (let command of this.commands)
            if (command.command === execArg)
                command.execute()
    }

    getSearchResult(userInput) {
        let result = []

        for (let command of this.commands) {
            if (this.commandMatchesUserInput(command, userInput))
                result.push({
                    name: command.description,
                    execArg: command.command,
                    icon: this.icon
                })
        }

        return result
    }

    commandMatchesUserInput(command, userInput) {
        return stringHelpers.stringContainsSubstring(command.command, userInput)
            || stringHelpers.stringContainsSubstring(command.description, userInput)
    }
}