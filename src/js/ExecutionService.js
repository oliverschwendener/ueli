import open from 'open';
import {exec} from 'child_process';
import {ipcRenderer} from 'electron';
import Helper from './Helper';
import ElectronizrCommands from './ElectronizrCommands';

export default class ExecutionService {

    constructor() {
        this.helper = new Helper();
        this.electronizrCommands = new ElectronizrCommands().GetAll();
    }

    executeCustomCommand(command, allCustomCommands) {
        for (var customCommand of allCustomCommands)
            if (command === customCommand.code)
                this.executeProgram(customCommand.path);
    }

    executeWebUrlInput(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://'))
            url = `http://${url}`;

        open(url, error => {
            if (error) throw error;
        });
    }

    extractQueryPrefix(prefix, query, separator) {
        query = query.replace(prefix, '');
        query = query.split(' ');

        let result = [];
        for (let item of query) {
            if (item.length > 0)
                result.push(item);
        }

        return result.join(separator);
    }

    executeWebSearch(input, allWebSearches) {
        let prefix = input.split(':')[0];
        let query = input.split(':')[1];
        query = this.helper.splitStringToArray(query).join('+');

        for (let search of allWebSearches) {
            if (prefix === search.prefix) {
                this.executeWebUrlInput(`${search.url}${query}`);
            }
        }
    }

    executeWindowsPathInput(path) {
        let command = `"" "${path}"`;
        this.startProcess(command);
    }

    executeShellCommand(command) {
        command = command.replace('>', '').toLowerCase();
        command = `cmd.exe /K ${command}`;
        this.startProcess(command);
    }

    executeProgram(path) {
        let command = `"" "${path}"`;
        this.startProcess(command);
    }

    executeEzrCommand(command) {
        for (let ezrCommand of this.electronizrCommands)
            if (ezrCommand.command === command)
                ezrCommand.execute();
    }

    startProcess(pathToLnk) {
        if (pathToLnk === '') return;

        let cmd = exec(`start ${pathToLnk}`, (error, stdout, stderr) => {
            if (error)
                throw error;
        });

        resetGui();
    }
}