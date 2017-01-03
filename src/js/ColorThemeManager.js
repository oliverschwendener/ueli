import fs from 'fs';
import ConfigHelper from './ConfigHelper.js';

export default class ColorThemeManager {
    constructor() {
        this.defaultColorTheme = 'osc-dark-blue';
    }

    getColorTheme() {
        let userColorTheme = new ConfigHelper().getConfig().colorTheme

        if(userColorTheme === undefined)
            userColorTheme = this.defaultColorTheme;

        return userColorTheme;
    }
}