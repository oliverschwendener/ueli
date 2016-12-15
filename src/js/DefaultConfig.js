import os from 'os';
import fs from 'fs';

export default class DefaultConfig {
    constructor() {
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
            customShortcuts: []
        }

        if(!fs.existsSync('config.json'))
            fs.writeFileSync('config.json', JSON.stringify(this.config));
    }

    getConfig() {
        return this.config;
    }
}