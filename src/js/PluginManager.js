import InstalledPrograms from './Plugins/InstalledPrograms'
import WebUrl from './Plugins/WebUrl'
import WebSearch from './Plugins/WebSearch'
import CommandLine from './Plugins/CommandLine'
import EzrCommands from './Plugins/EzrCommands'
import FileBrowser from './Plugins/FileBrowser'
import Windows10SettingsAndApps from './Plugins/Windows10SettingsAndApps'
import HomeFolderPlugin from './Plugins/HomeFolderPlugin'
import ConfigManager from './ConfigManager'
import ConfigHelpers from './Helpers/ConfigHelpers'
import StringHelpers from './Helpers/StringHelpers'
import FavoritesManager from './FavoritesManager'
import { setTimeout } from 'timers';

let configHelpers = new ConfigHelpers()
let stringHelpers = new StringHelpers()

export default class PluginManager {
    constructor() {
        this.plugins = []
        this.defaultIcon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                                <g id="surface1">
                                    <path d="M 19 3 C 13.488281 3 9 7.488281 9 13 C 9 15.394531 9.839844 17.589844 11.25 19.3125 L 3.28125 27.28125 L 4.71875 28.71875 L 12.6875 20.75 C 14.410156 22.160156 16.605469 23 19 23 C 24.511719 23 29 18.511719 29 13 C 29 7.488281 24.511719 3 19 3 Z M 19 5 C 23.429688 5 27 8.570313 27 13 C 27 17.429688 23.429688 21 19 21 C 14.570313 21 11 17.429688 11 13 C 11 8.570313 14.570313 5 19 5 Z "></path>
                                </g>
                            </svg>`

        this.setPluginsFromConfig()
        this.favorites = new FavoritesManager().getFavorites()
        this.reloadFavorites(30)
    }

    reloadFavorites(timeOutInSeconds) {
        setInterval(() => {
            this.favorites = new FavoritesManager().getFavorites()
        }, timeOutInSeconds * 1000)
    }

    isValid(args) {
        return this.getValidPlugin(args) !== undefined
    }

    execute(execArg, callback) {
        new FavoritesManager().addFavorite(execArg)
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

            if (stringHelpers.stringIsEmptyOrWhitespaces(item.icon))
                item.icon = this.defaultIcon
        }

        let resultWithFavorites = this.addFavoritesToSearchResult(unsortedResult)

        let resultWithCustomShortCuts = this.addCustomShortcutsToSearchResult(resultWithFavorites, userInput)

        return this.getSortedResult(resultWithCustomShortCuts)
    }

    addCustomShortcutsToSearchResult(searchResult, userInput) {
        let shortcutIcon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                                <g id="surface1">
                                    <path style=" " d="M 19.71875 5.28125 L 18.28125 6.71875 L 24.5625 13 L 11 13 C 7.144531 13 4 16.144531 4 20 C 4 23.855469 7.144531 27 11 27 L 11 25 C 8.226563 25 6 22.773438 6 20 C 6 17.226563 8.226563 15 11 15 L 24.5625 15 L 18.28125 21.28125 L 19.71875 22.71875 L 27.71875 14.71875 L 28.40625 14 L 27.71875 13.28125 Z "></path>
                                </g>
                            </svg>`

        let customShortcuts = new ConfigManager().getConfig().customShortcuts

        for (let customShortcut of customShortcuts) {
            if (userInput.toLowerCase() == customShortcut.shortCut.toLowerCase())
                searchResult.push({
                    name: customShortcut.name,
                    execArg: customShortcut.execArg,
                    icon: shortcutIcon,
                    weight: 0
                })
        }

        return searchResult
    }

    addFavoritesToSearchResult(searchResult) {
        let result = searchResult

        if (this.favorites.length > 0)
            for (let item of result)
                for (let favorite of this.favorites)
                    if (favorite.execArg === item.execArg)
                        item.weight = item.weight - favorite.counter

        return result
    }

    getSortedResult(unsorted) {
        return unsorted.sort((a, b) => {
            if (a.weight > b.weight) return 1
            if (a.weight < b.weight) return -1
            return 0
        })
    }

    getValidPlugin(args) {
        for (let plugin of this.plugins)
            if (plugin.isValid(args))
                return plugin
    }

    setPluginsFromConfig() {
        let allPlugins = [
            new InstalledPrograms(),
            new Windows10SettingsAndApps(),
            new HomeFolderPlugin(),
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

    getAutoCompletionResult(searchResultItem) {
        for (let plugin of this.plugins) {
            if (plugin.isValid(searchResultItem.execArg)) {
                if (plugin.getName() === 'File Browser') {
                    return searchResultItem.execArg.endsWith('\\')
                        ? `${searchResultItem.execArg}`
                        : `${searchResultItem.execArg}\\`
                }
                else {
                    return searchResultItem.name
                }
            }
        }
    }
}
