import InstalledPrograms from './Plugins/InstalledPrograms'
import WebUrl from './Plugins/WebUrl'
import WebSearch from './Plugins/WebSearch'
import CustomShortcuts from './Plugins/CustomShortcuts'
import CommandLine from './Plugins/CommandLine'
import EzrCommands from './Plugins/EzrCommands'
import FileBrowser from './Plugins/FileBrowser'

export default class PluginManager {
    constructor() {
        this.plugins = [
            new CustomShortcuts(),
            new InstalledPrograms(),
            new WebUrl(),
            new WebSearch(),
            new CommandLine(),
            new EzrCommands(),
            new FileBrowser
        ]
    }

    isValid(args) {
        return this.getValidPlugin(args) !== undefined
    }

    execute(userInput, execArg, callback) {
        this.getValidPlugin(userInput).execute(execArg, callback)
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
            : () => {}
    }

    getValidPlugin(args) {
        for (let plugin of this.plugins)
             if (plugin.isValid(args))
                return plugin;
    }
}