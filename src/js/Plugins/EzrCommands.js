import { exec } from 'child_process'
import { ipcRenderer } from 'electron'

import ConfigManager from './../ConfigManager'
import StringHelpers from './../Helpers/StringHelpers'
import ExecutionService from './../ExecutionService'

let commandPrefix = 'ezr'
let stringHelpers = new StringHelpers()
let executionService = new ExecutionService()

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
                    executionService.openDefaultBrowser('https://github.com/oliverschwendener/electronizr#electronizr')
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

        this.icon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1">
                        <g id="surface1">
                            <path style=" " d="M 0 1 L 0 10.5 L 19 12 L 0 13.5 L 0 23 L 24 12 Z "></path>
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