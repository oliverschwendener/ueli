import { spawn } from 'child_process'

let commandLinePrefix = '>'

export default class CommandLine {
    constructor() {
        this.icon = 'fa fa-terminal'
    }

    isValid(userInput) {
        return userInput.startsWith(commandLinePrefix)
            && userInput.replace(commandLinePrefix, '').replace(' ', '').length > 0
    }

    execute(execArg, callback, kill) {
        let items = execArg.split(' ')
        let programName = items[0]
        let options = []

        for (let i = 0; i < items.length; i++) {
            if (i === 0)
                continue
            else
                options.push(items[i])
        }

        let command = spawn(programName, options)

        command.stderr.on('data', (data) => {
            callback(data.toString())
        })

        command.stdout.on('data', (data) => {
            callback(data.toString())
        })

        command.on('exit', (code) => {
            callback(`Finished.`)
        })

        document.addEventListener('keyup', (e) => {
            if (e.ctrlKey && e.key === 'c')
                command.kill('SIGINT')
        })
    }

    getSearchResult(userInput) {
        let command = userInput.replace(commandLinePrefix, '')

        return [{
            name: `Execute ${command}`,
            execArg: command
        }]
    }

    getIcon() {
        return this.icon
    }
}