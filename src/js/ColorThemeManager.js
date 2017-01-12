import fs from 'fs';
import ConfigHelper from './ConfigHelper.js';

export default class ColorThemeManager {
    constructor() {
        this.defaultColorTheme = 'osc-dark-blue';
        this.defaultHighlightColorTheme = 'atom-one-dark';
    }

    getColorTheme() {
        let userColorTheme = new ConfigHelper().getConfig().colorTheme;

        if(userColorTheme === undefined)
            userColorTheme = this.defaultColorTheme;

        return userColorTheme;
    }

    getHighlightColorTheme() {
        let userHighLightColorTheme = new ConfigHelper().getConfig().highlightColorTheme;

        if (userHighLightColorTheme === undefined)
            userHighLightColorTheme = this.defaultHighlightColorTheme;
        
        return userHighLightColorTheme;
    }
}