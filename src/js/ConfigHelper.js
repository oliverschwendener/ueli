import os from 'os';
import fs from 'fs';
import Constants from './Constants.js';

export default class ConfigHelper {
    constructor() {
        this.configFilePath = new Constants().getConfigFilePath();
        this.defaultConfig = {
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
        };

        this.writeDefaultConfigIfItDoesntExistYet();
    }

    writeDefaultConfigIfItDoesntExistYet() {
        if (!fs.existsSync(this.configFilePath))
            fs.writeFileSync(this.configFilePath, JSON.stringify(this.defaultConfig));
    }

    getConfig() {
        return JSON.parse(fs.readFileSync(this.configFilePath));
    }

    saveConfig(newConfig) {
        fs.writeFileSync(this.configFilePath, JSON.stringify(newConfig));
    }
}