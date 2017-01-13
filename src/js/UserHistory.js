import fs from 'fs';
import ConfigHelper from './ConfigHelper';

export default class UserHistory {
    constructor() {
        this.history = this.getHistoryFromConfiGile();
    }

    addItem(path) {
        try {
            if (this.itemAlreadyExists(path))
                this.updateItem(path);
            else
                this.addNewItem(path);
        }
        finally {
            this.writeHistoryToConfigFile();
        }
    }

    itemAlreadyExists(path) {
        for (let item of this.history)
            if (item.path === path)
                return true;

        return false;
    }

    addNewItem(path) {
        let newItem = {
            path: path,
            counter: 1
        }

        this.history.push(newItem);
    }

    updateItem(path) {
        for (let item of this.history)
            if (item.path === path)
                item.counter++;
    }

    getItems() {
        return this.history;
    }

    getHistoryFromConfiGile() {
        return new ConfigHelper().getConfig().history;
    }

    writeHistoryToConfigFile() {
        let config = new ConfigHelper().getConfig();
        config.history = this.history;
        new ConfigHelper().saveConfig(config);
    }
}