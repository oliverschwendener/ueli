import { spawn } from 'child_process'
import StringHelpers from '../Helpers/StringHelpers'

let stringHelpers = new StringHelpers()

export default class WebUrl {
    constructor() {
        this.icon = 'fa fa-windows'
        this.name = 'Windows 10 System Commands'
        this.commands = [
            {
                name: 'Shutdown',
                execArg: 'shutdown -s -t 0'
            },
            {
                name: 'Log off',
                execArg: 'shutdown /l'
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
        spawn(`${execArg}`, (err, stdout, sterr) => {
            if (err) throw err
        })
    }

    getSearchResult(userInput) {
        let result = []

        for (let command of this.commands)
            if (this.commandMatchesUserInput(command, userInput))
                result.push({
                    name: command.name,
                    execArg: command.execArg
                })

        return result
    }

    commandMatchesUserInput(command, userInput) {
        return stringHelpers.stringContainsSubstring(command.name, userInput)
            || stringHelpers.stringContainsSubstring(command.execArg, userInput)
    }

    getIcon(userInput) {
        return this.icon
    }
}