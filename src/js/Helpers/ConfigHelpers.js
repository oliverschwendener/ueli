import ConfigManager from './../ConfigManager'

let config = new ConfigManager().getConfig()

export default class ConfigHelpers {
    pluginIsActive(pluginName) {
        let plugins = config.plugins

        for (let plugin of plugins) {
            if (plugin.name.toLowerCase() === pluginName.toLowerCase())
                if (plugin.active)
                    return true
        }

        return false
    }
}