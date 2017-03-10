import ConfigManager from './ConfigManager'

let configManager = new ConfigManager()

export default class HistoryManager {
    constructor() {
        this.history = []
        this.index = this.history.length
    }

    addItem(item) {
        if (item === '' || item === undefined)
            return

        this.history.push(item)
        this.index = this.history.length
    }

    getPrevious() {
        if (this.history.length === 0)
            return ''

        if (this.index !== 0)
            this.index--

        return this.history[this.index]
    }

    getNext() {
        if (this.index < this.history.length)
            this.index++

        if (this.index >= this.history.length)
            return ''

        return this.history[this.index]
    }
}