import InstalledPrograms from './Plugins/InstalledPrograms'

export default class PluginManager {
    constructor() {
        this.plugins = [
            new InstalledPrograms()
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