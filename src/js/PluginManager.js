import InstalledPrograms from './Plugins/InstalledPrograms'
import WebUrl from './Plugins/WebUrl'
import WebSearch from './Plugins/WebSearch'
import CustomShortcuts from './Plugins/CustomShortcuts'
import CommandLine from './Plugins/CommandLine'
import EzrCommands from './Plugins/EzrCommands'
import FileBrowser from './Plugins/FileBrowser'
import Windows10Settings from './Plugins/Windows10Settings'
import ConfigManager from './ConfigManager'
import ConfigHelpers from './Helpers/ConfigHelpers'

let configHelpers = new ConfigHelpers()

export default class PluginManager {
    constructor() {
        this.plugins = []
        this.setPluginsFromConfig()
        this.defaultIcon = 'fa fa-search'
    }

    isValid(args) {
        return this.getValidPlugin(args) !== undefined
    }

    execute(execArg, callback) {
        this.getValidPlugin(execArg).execute(execArg, callback)
    }

    getSearchResult(userInput) {
        let validPlugin = this.getValidPlugin(userInput)
        return validPlugin !== undefined
            ? validPlugin.getSearchResult(userInput)
            : []
    }

    getAutoCompletion(userInput) {
        let validPlugin = this.getValidPlugin(userInput)
        return (validPlugin !== undefined && validPlugin.getAutoCompletion !== undefined)
            ? validPlugin.getAutoCompletion
            : () => { }
    }

    getIcon(userInput) {
        let validPlugin = this.getValidPlugin(userInput)
        let result
        try {
            result = validPlugin.getIcon(userInput)
        }
        catch (exception) {
            result = this.defaultIcon
        }

        return isValidFontAwesomeIcon(result)
            ? result
            : this.defaultIcon
    }

    getValidPlugin(args) {
        for (let plugin of this.plugins)
            if (plugin.isValid(args))
                return plugin
    }

    setPluginsFromConfig() {
        let allPlugins = [
            new CustomShortcuts(),
            new InstalledPrograms(),
            new Windows10Settings(),
            new WebUrl(),
            new WebSearch(),
            new CommandLine(),
            new EzrCommands(),
            new FileBrowser()
        ]

        let activePlugins = []

        for (let plugin of allPlugins) {
            if (configHelpers.pluginIsActive(plugin.getName()))
                activePlugins.push(plugin)
        }

        this.plugins = activePlugins
    }
}

function isValidFontAwesomeIcon(icon) {
    return icon !== undefined
        && icon !== null
        && icon.startsWith('fa ')
}