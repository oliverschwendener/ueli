import { exec } from 'child_process';
import { ipcRenderer } from 'electron';

export default class EzrCommandExecutor {
    constructor() {
        this.commands = [
            {
                code: 'ezr:reload',
                execute: () => {
                    ipcRenderer.sendSync('reload-window');
                },
                infoMessage: 'Reload electronizr'
            },
            {
                code: 'exit',
                execute: () => {
                    ipcRenderer.sendSync('close-main-window');
                },
                infoMessage: 'Exit electronizr'
            },
            {
                code: 'ezr:config',
                execute: () => {
                    exec('start "" "config.json"', (error) => {
                        if (error)
                            throw error;
                    });
                },
                infoMessage: 'Edit configuration'
            }
        ];
    }

    isValid(input) {
        for (let command of this.commands)
            if (command.code === input)
                return true;

        return false;
    }

    execute(input) {
        for (let command of this.commands)
            if (command.code === input) {
                command.execute();
                return;
            }
    }

    getInfoMessage(input) {
        for (let command of this.commands)
            if (command.code === input)
                return command.infoMessage;
    }
}