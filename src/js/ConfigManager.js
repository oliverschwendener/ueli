import fs from 'fs'

let configFilePath = `${process.env.USERPROFILE}\\ezr_config.json`

export default class ConfigManager {
    constructor() {
        if (!fs.existsSync(configFilePath))
            fs.writeFileSync(configFilePath, JSON.stringify(getDefaultConfig()), 'utf-8')

        this.config = getConfigFromConfigFile()
    }

    getConfig() {
        return this.config
    }

    setConfig(config) {
        if (fs.existsSync(configFilePath))
            fs.writeFileSync(configFilePath, JSON.stringify(config), 'utf-8')
        else
            alert(this.getMissingConfigFileMessage())
    }

    getConfigFilePath() {
        return configFilePath
    }

    getMissingConfigFileMessage() {
        return `There is no config file (${configFilePath})`
    }

    resetConfigToDefault() {
        this.setConfig(getDefaultConfig())
    }
}

function getDefaultConfig() {
    return {
        keyboardShortcut: 'alt+space',
        size: {
            width: 960,
            height: 600
        },
        zoomFactor: 1.0,
        fullscreen: false,
        colorTheme: 'osc-dark-blue',
        folders: [
            `C:\\ProgramData\\Microsoft\\Windows\\Start Menu`,
            `${process.env.USERPROFILE}\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu`,
            `${process.env.USERPROFILE}\\Desktop`
        ],
        rescanInterval: 30,
        webSearches: [
            { name: 'Google', prefix: 'g', url: 'https://google.com/search?q=', icon: 'fa fa-google' },
            { name: 'Google Image', prefix: 'gi', url: 'https://www.google.com/search?tbm=isch&q=', icon: 'fa fa-picture-o' },
            { name: 'YouTube', prefix: 'yt', url: 'https://www.youtube.com/results?search_query=', icon: 'fa fa-youtube-play' },
            { name: 'Linguee', prefix: 'l', url: 'http://www.linguee.de/deutsch-englisch/search?source=auto&query=', icon: 'fa fa-language' },
            { name: 'DuckDuckGo', prefix: 'd', url: 'https://duckduckgo.com/?q=', icon: 'fa fa-search'}
        ],
        customShortcuts: [],
        favorites: []
    }
}

function getConfigFromConfigFile() {
    return JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
}