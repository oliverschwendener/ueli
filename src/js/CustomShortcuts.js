import fs from 'fs';

export default class CustomShortcuts {
    getCustomShortcuts() {
        let userConfig = [];
        let configFilePath = './config.json';

        if(fs.existsSync(configFilePath)) {
            let configFileContent = fs.readFileSync(configFilePath);
            userConfig = JSON.parse(configFileContent);
        }

        if(userConfig.customShortcuts !== undefined)
            return userConfig.customShortcuts;

        else return [
            {
                code: 'c',
                path: 'C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Google Chrome.lnk'
            }
        ];
    }
}