import { exec } from 'child_process';
import { ipcRenderer } from 'electron';
import fs from 'fs';
import Constants from './Constants.js';
import DefaultConfig from './DefaultConfig';

export default class EzrCommandExecutor {
    constructor() {
        this.defaultConfig = new DefaultConfig().getConfig();
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
        if (fs.existsSync(this.configFilePath)) {
            let currentConfigJson = fs.readFileSync(this.configFilePath, 'utf8');
            let config = JSON.parse(currentConfigJson);
            config.history = [];
            let newConfigJson = JSON.stringify(config);
            fs.writeFileSync(this.configFilePath, newConfigJson);
        }
    }
}