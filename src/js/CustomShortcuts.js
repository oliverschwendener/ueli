import fs from 'fs';
import ConfigManager from './Managers/ConfigManager';

export default class CustomShortcuts {
    getCustomShortcuts() {
        let userConfig = new ConfigManager().getConfig();

        if (userConfig.customShortcuts !== undefined)
            return userConfig.customShortcuts;
        else
            return [];
    }
}