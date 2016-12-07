import { ipcRenderer } from 'electron';

export default class ElectronizrCommands {

    constructor() {
        this.commands = [
            {
                command: 'exit',
                execute: function () {
                    ipcRenderer.sendSync('close-main-window');
                }
            },
            {
                command: 'ezr:reload',
                execute: function () {
                    ipcRenderer.sendSync('reload-window');
                }
            },
            {
                command: 'ezr:config',
                execute: function () {
                    OpenConfigFile();
                }
            },
            {
                command: 'ezr:default-config',
                execute: function () {
                    LoadDefaultConfig();
                }
            },
            {
                command: 'ezr:dark-theme',
                execute: function () {
                    ChangeTheme('dark');
                }
            },
            {
                command: 'ezr:light-theme',
                execute: function () {
                    ChangeTheme('light');
                }
            },
            {
                command: 'ezr:win10-theme',
                execute: function () {
                    ChangeTheme('win10');
                }
            }
        ]
    }

    GetAll() {
        return this.commands;
    }
}