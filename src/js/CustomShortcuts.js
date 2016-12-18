import fs from 'fs';
import Constants from './Constants.js';

export default class CustomShortcuts {
    constructor() {
        this.configFilePath = new Constants().getConfigFilePath();
    }

    getCustomShortcuts() {
        let userConfig = {};

        if (fs.existsSync(this.configFilePath)) {
            let configFileContent = fs.readFileSync(this.configFilePath);
            userConfig = JSON.parse(configFileContent);
        }

        if (userConfig.customShortcuts !== undefined)
            return userConfig.customShortcuts;

        else return [];
    }
}