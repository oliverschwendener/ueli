import open from 'open';
import { exec } from 'child_process';
import { ipcRenderer } from 'electron';
import Helper from './Helper';

export default class ExecutionService {

    constructor() {
        this.helper = new Helper();
    }

    HandleUrlInput(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://'))
            url = `http://${url}`;

        open(url, error => {
            if (error) throw error;
        });

        ResetGui();
    }

    ExtractQueryPrefix(prefix, query, separator) {
        query = query.replace(prefix, '');
        query = query.split(' ');

        let result = [];
        for (let item of query) {
            if (item.length > 0)
                result.push(item);
        }

        return result.join(separator);
    }

    HandleWebSearch(input, allWebSearches) {
        let prefix = input.split(':')[0];
        let query = input.split(':')[1];
        query = this.helper.SplitStringToArray(query).join('+');

        for (let search of allWebSearches) {
            if (prefix === search.prefix) {
                this.HandleUrlInput(`${search.url}${query}`);
            }
        }
    }

    HandleWindowsPathInput(path) {
        let command = `"" "${path}"`;
        this.StartProcess(command);
    }

    HandleShellCommand(command) {
        command = command.replace('>', '').toLowerCase();
        command = `cmd.exe /K ${command}`;
        this.StartProcess(command);
    }

    HandleStartProgram(path) {
        let command = `"" "${path}"`;
        this.StartProcess(command);
    }

    HandleElectronizrCommand(command) {
        switch (command) {
            case 'exit':
                ipcRenderer.sendSync('close-main-window');
                return;;

            case 'ezr:reload':
                ipcRenderer.sendSync('reload-window');
                return;;

            case 'ezr:config':
                OpenConfigFile();
                return;

            case 'ezr:default-config': 
                LoadDefaultConfig();
                return;

            case 'ezr:dark-theme':
                ChangeTheme('dark');
                return;;

            case 'ezr:win10-theme':
                ChangeTheme('win10');
                return;

            case 'ezr:light-theme':
                ChangeTheme('light');
                return;

            default:
                return;
        }
    }

    StartProcess(pathToLnk) {
        if (pathToLnk === '') return;

        let cmd = exec(`start ${pathToLnk}`, (error, stdout, stderr) => {
            if (error)
                throw error;
        });

        ResetGui();
    }
}