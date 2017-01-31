import { exec } from 'child_process';
import { ipcRenderer } from 'electron';
import fs from 'fs';
import Constants from './../Constants';
import ConfigHelper from './../ConfigHelper';

export default class EzrCommandExecutor {
    constructor() {
        this.configFilePath = new Constants().getConfigFilePath();
        this.commands = [
            {
                code: 'ezr:reload',
                execute: () => {
                    ipcRenderer.send('reload-window');
                },
                infoMessage: 'Reload electronizr',
                icon: 'fa fa-refresh'
            },
            {
                code: 'ezr:exit',
                execute: () => {
                    ipcRenderer.send('close-main-window');
                },
                infoMessage: 'Exit electronizr',
                icon: 'fa fa-sign-out'
            },
            {
                code: 'ezr:config',
                execute: () => {
                    exec(`start "" "${this.configFilePath}"`, (error) => {
                        if (error)
                            throw error;
                    });
                },
                infoMessage: 'Edit configuration file',
                icon: 'fa fa-wrench'
            },
            {
                code: 'ezr:reset-history',
                execute: () => {
                    this.resetHistory();
                },
                infoMessage: 'Resets user history',
                icon: 'fa fa-history'
            }
        ];
    }

    isValid(userInput) {
        return (this.getCommandByUserInput(userInput) !== undefined)
            ? true
            : false;
    }

    execute(userInput) {
        let command = this.getCommandByUserInput(userInput);
        command.execute();
    }

    getInfoMessage(userInput) {
        let command = this.getCommandByUserInput(userInput);
        return `<div>
                    <p class="result-name">${command.infoMessage}</p>
                    <p class="result-description">electronizr specific command</p>
                </div>`;
    }

    getIcon(userInput) {
        return this.getCommandByUserInput(userInput).icon;
    }

    resetHistory() {
        let config = new ConfigHelper().getConfig();
        config.history = [];
        new ConfigHelper().saveConfig(config);
    }

    getCommandByUserInput(userInput) {
        for (let command of this.commands)
            if (command.code.toLowerCase() === userInput.toLowerCase())
                return command;

        return undefined;
    }
}