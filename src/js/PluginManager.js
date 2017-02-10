import InstalledPrograms from './Plugins/InstalledPrograms'
import WebUrl from './Plugins/WebUrl'
import WebSearch from './Plugins/WebSearch'
import CustomShortcuts from './Plugins/CustomShortcuts'

export default class PluginManager {
    constructor() {
        this.plugins = [
            new CustomShortcuts(),
            new InstalledPrograms(),
            new WebUrl(),
            new WebSearch()
        ]
    }

    isValid(args) {
        for (let plugin of this.plugins)
            if (plugin.isValid(args))
                return true

        return false
    }

    execute(userInput, execArg) {
        for (let plugin of this.plugins)
            if (plugin.isValid(userInput))
                plugin.execute(execArg)
    }

    getSearchResult(args) {
        for (let plugin of this.plugins)
            if (plugin.isValid(args))
                return plugin.getSearchResult(args)

        return []
    }
}