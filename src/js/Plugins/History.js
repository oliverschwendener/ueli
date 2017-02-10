import ConfigManager from './../ConfigManager'

let configManager = new ConfigManager()

export default class History {
    constructor() {
        this.history = configManager.getConfig().history
        this.index = 1
    }

    additem(filePath) {
        this.history.push(filePath)
        this.index++

        let config = configManager.getConfig()
        config.history = this.history
        configManager.setConfig(config)
    }

    getPrevious() {
        if (this.index > 0)
            this.index--;

        return this.history[this.index];
    }

    getNext() {
        if (this.index < this.history.length)
            this.index++;

        return this.history[this.index];
    }

    isAtLastIndex() {
        return this.history.length <= this.index;
    }
}