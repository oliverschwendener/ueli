import InstalledPrograms from './Plugins/InstalledPrograms'
import WebUrl from './Plugins/WebUrl'

export default class PluginManager {
    constructor() {
        this.plugins = [
            new InstalledPrograms(),
            new WebUrl()
        ]
    }

    isValid(args) {
        for (let plugin of this.plugins)
            if (plugin.isValid(args))
                return true

        return false
    }

    execute(args) {
        for (let plugin of this.plugins)
            if (plugin.isValid(args))
                plugin.execute(args)
    }

    getSearchResult(args) {
        for (let plugin of this.plugins)
            if (plugin.isValid(args))
                return plugin.getSearchResult(args)

        return []
    }
}