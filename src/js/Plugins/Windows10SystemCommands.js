import { spawnSync } from 'child_process'
import StringHelpers from '../Helpers/StringHelpers'

let stringHelpers = new StringHelpers()

export default class WebUrl {
    constructor() {
        this.icon = 'fa fa-windows'
        this.name = 'Windows 10 System Commands'
        this.commands = [
            {
                name: 'Shutdown',
                execArg: 'shutdown -s -t 0',
                command: 'shutdown',
                options: ['-s', '-t', '0']
            },
            {
                name: 'Log off',
                execArg: 'shutdown /l',
                command: 'shutdown',
                options: ['/l']
            },
            {
                name: 'Windows Version',
                execArg: 'winver',
                command: 'winver',
                options: []
            }
        ]
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
        let command = this.getCommand(execArg)
        if (command !== undefined) {
            spawnSync(command.command, command.options)
        }
        else {
            alert('Unknown command')
        }
    }

    getCommand(execArg) {
        for (let command of this.commands) {
            if (command.execArg === execArg)
                return command
        }
    }

    getSearchResult(userInput) {
        let result = []

        for (let command of this.commands)
            if (this.commandMatchesUserInput(command, userInput))
                result.push({
                    name: command.name,
                    execArg: command.execArg,
                    icon: this.icon
                })

        return result
    }

    commandMatchesUserInput(command, userInput) {
        return stringHelpers.stringContainsSubstring(command.name, userInput)
            || stringHelpers.stringContainsSubstring(command.execArg, userInput)
    }
}