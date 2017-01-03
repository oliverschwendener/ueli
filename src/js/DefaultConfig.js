import os from 'os';
import fs from 'fs';
import Constants from './Constants.js';

export default class DefaultConfig {
    constructor() {
        this.configFilePath = new Constants().getConfigFilePath();
        this.config = {
            folders: [
                'C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs',
                `${os.homedir()}\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs`,
                `${os.homedir()}\\Desktop`
            ],
            webSearches: [
                {
                    name: "Google",
                    prefix: "g",
                    url: "https://google.com/search?q="
                }
            ],
            customShortcuts: [],
            history: []
        }

        if(!fs.existsSync(this.configFilePath))
            fs.writeFileSync(this.configFilePath, JSON.stringify(this.config));
    }

    getConfig() {
        return this.config;
    }
}