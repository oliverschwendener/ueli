import fs from 'fs';
import ConfigHelper from './ConfigHelper.js';

export default class CustomShortcuts {
    getCustomShortcuts() {
        let userConfig = new ConfigHelper().getConfig();

        if (userConfig.customShortcuts !== undefined)
            return userConfig.customShortcuts;
        else
            return [];
    }
}