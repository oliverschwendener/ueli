import { spawn } from 'child_process'

let commandLinePrefix = '>'

export default class CommandLine {
    constructor() {
        this.icon = 'fa fa-terminal'
    }

    isValid(userInput) {
        return userInput.startsWith(commandLinePrefix)
            && !stringIsEmptyOrWhitespaces(userInput)
    }

    execute(execArg, callback, kill) {
        let items = execArg.split(' ')
        let programName = items[0]
        if (programName.startsWith(commandLinePrefix))
            programName = programName.replace(commandLinePrefix, '')

        let options = []

        for (let i = 0; i < items.length; i++) {
            if (i === 0)
                continue
            else
                options.push(items[i])
        }

        try {
            let command = spawn(programName, options)

            command.on('error', (err) => {
                callback(err)
                command.kill('SIGINT')
            })

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
        catch(ex) {
            callback('There was an error')
        }
    }

    getSearchResult(userInput) {
        let command = userInput.replace(commandLinePrefix, '')

        return [{
            name: `Execute ${command}`,
            execArg: userInput
        }]
    }

    getIcon() {
        return this.icon
    }
}

function stringIsEmptyOrWhitespaces(string) {
    return string === undefined || string.replace(/\s/g, '').length === 0
}