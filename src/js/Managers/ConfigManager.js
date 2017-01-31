import os from 'os';
import fs from 'fs';
import ConstantsManager from './ConstantsManager';

export default class ConfigManager {
    constructor() {
        this.configFilePath = new ConstantsManager().getConfigFilePath();
        this.noConfigFileMessage = `There is no config file. Please make sure there is an appropriate .json file in your home directory (${this.configFilePath})`;
        this.defaultConfig = {
            hotKey: 'alt+space',
            colorTheme: 'osc-dark-blue',
            highlightColorTheme: 'atom-one-dark',
            welcomeMessage: 'What are you looking for?',
            scrollAnimationSpeed: 'fast',
            folders: [
                'C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs',
                `${os.homedir()}\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs`,
                `${os.homedir()}\\Desktop`
            ],
            webSearches: [
                {
                    name: 'Google',
                    prefix: 'g',
                    url: 'https://google.com/search?q=',
                    icon: 'fa fa-google'
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
        if(!fs.existsSync(this.configFilePath)) {
            alert(this.noConfigFileMessage);
            return {};
        }
        
        return JSON.parse(fs.readFileSync(this.configFilePath));
    }

    saveConfig(newConfig) {
        if(!fs.existsSync(this.configFilePath))
            alert(this.noConfigFileMessage);
        else
            fs.writeFileSync(this.configFilePath, JSON.stringify(newConfig));
    }
}