import { exec } from 'child_process';
import { ipcRenderer } from 'electron';
import fs from 'fs';
import Constants from './Constants.js';
import ConfigHelper from './ConfigHelper';

export default class EzrCommandExecutor {
    constructor() {
        this.configFilePath = new Constants().getConfigFilePath();
        this.commands = [
            {
                code: 'ezr:reload',
                execute: () => {
                    ipcRenderer.sendSync('reload-window');
                },
                infoMessage: 'Reload electronizr'
            },
            {
                code: 'ezr:exit',
                execute: () => {
                    ipcRenderer.sendSync('close-main-window');
                },
                infoMessage: 'Exit electronizr'
            },
            {
                code: 'ezr:config',
                execute: () => {
                    exec(`start "" "${this.configFilePath}"`, (error) => {
                        if (error)
                            throw error;
                    });
                },
                infoMessage: 'Edit configuration file'
            },
            {
                code: 'ezr:reset-history',
                execute: () => {
                    this.resetHistory();
                },
                infoMessage: 'Resets user history'
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
                return `<div>
                            <p class="app-name">${command.infoMessage}</p>
                            <p class="app-path">electronizr specific command</p>
                        </div>`;
    }

    resetHistory() {
        let config = new ConfigHelper().getConfig();
        config.history = [];
        new ConfigHelper().saveConfig(config);
    }
}