import fs from 'fs';
import ConfigManager from './ConfigManager';

export default class ColorThemeManager {
    constructor() {
        this.defaultColorTheme = 'osc-dark-blue';
        this.defaultHighlightColorTheme = 'atom-one-dark';
    }

    getColorTheme() {
        let userColorTheme = new ConfigManager().getConfig().colorTheme;

        if(userColorTheme === undefined)
            userColorTheme = this.defaultColorTheme;

        return userColorTheme;
    }

    getHighlightColorTheme() {
        let userHighLightColorTheme = new ConfigManager().getConfig().highlightColorTheme;

        if (userHighLightColorTheme === undefined)
            userHighLightColorTheme = this.defaultHighlightColorTheme;
        
        return userHighLightColorTheme;
    }
}