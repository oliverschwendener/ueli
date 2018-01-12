import InstalledPrograms from './Plugins/InstalledPrograms'
import WebUrl from './Plugins/WebUrl'
import WebSearch from './Plugins/WebSearch'
import CustomShortcuts from './Plugins/CustomShortcuts'
import CommandLine from './Plugins/CommandLine'
import EzrCommands from './Plugins/EzrCommands'
import FileBrowser from './Plugins/FileBrowser'
import Windows10Settings from './Plugins/Windows10Settings'
import Windows10SystemCommands from './Plugins/Windows10SystemCommands'
import ConfigManager from './ConfigManager'
import ConfigHelpers from './Helpers/ConfigHelpers'
import StringHelpers from './Helpers/StringHelpers'
import FavoritesManager from './FavoritesManager'

let configHelpers = new ConfigHelpers()
let stringHelpers = new StringHelpers()

export default class PluginManager {
    constructor() {
        this.plugins = []
        this.setPluginsFromConfig()
        this.defaultIcon = 'fa fa-search'
        this.favorites = new FavoritesManager().getFavorites()
    }

    isValid(args) {
        return this.getValidPlugin(args) !== undefined
    }

    execute(execArg, callback) {
        this.getValidPlugin(execArg).execute(execArg, callback)
    }

    getSearchResult(userInput) {
        let unsortedResult = []

        for (let plugin of this.plugins) {
            if (plugin.isValid(userInput))
                unsortedResult = unsortedResult.concat(plugin.getSearchResult(userInput))
        }

        for (let item of unsortedResult) {
            item.weight = stringHelpers.getWeight(item.name, userInput)
            item.isActive = false
        }

        let resultWithFavorites = this.addFavoritesToSearchResult(unsortedResult)

        return this.getSortedResult(resultWithFavorites)
    }

    addFavoritesToSearchResult(searchResult) {
        let result = searchResult

        if (this.favorites.length > 0)
            for (let item of result)
                for (let favorite of this.favorites)
                    if (favorite.path === item.execArg)
                        item.weight = item.weight - (favorite.counter)

        return result
    }

    getSortedResult(unsorted) {
        return unsorted.sort((a, b) => {
            if (a.weight > b.weight) return 1
            if (a.weight < b.weight) return -1
            return 0
        })
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
            new Windows10SystemCommands(),
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