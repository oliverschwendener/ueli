import fs from 'fs';
import Constants from './Constants.js';

export default class UserHistory {
    constructor() {
        this.configFilePath = new Constants().getConfigFilePath();
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
        let result = [];
        if (fs.existsSync(this.configFilePath)) {
            let configJson = fs.readFileSync(this.configFilePath)
            let config = JSON.parse(configJson);
            if (config.history !== undefined)
                result = config.history;
        }

        return result;
    }

    writeHistoryToConfigFile() {
        if (fs.existsSync(this.configFilePath)) {
            let currentConfigJson = fs.readFileSync(this.configFilePath, 'utf8');
            let currentConfig = JSON.parse(currentConfigJson);

            currentConfig.history = this.history;

            let newConfigJson = JSON.stringify(currentConfig);
            fs.writeFileSync(this.configFilePath, newConfigJson);
        }
    }
}