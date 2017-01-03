import fs from 'fs';
import ConfigHelper from './ConfigHelper.js';

export default class ColorThemeManager {
    constructor() {
        this.defaultColorTheme = 'osc-dark-blue';
    }

    getColorTheme() {
        let userColorTheme = new ConfigHelper().getConfig().colorTheme

        if(!fs.existsSync(`./css/${userColorTheme}.css`) || userColorTheme === undefined)
            userColorTheme = this.defaultColorTheme;

        return userColorTheme;
    }
}