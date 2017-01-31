import fs from 'fs';
import ConfigManager from './Managers/ConfigManager';

export default class Favorites {
    constructor() {
        this.favorites = this.getFavoritesFromConfigFile();
    }

    addItem(path) {
        try {
            if (this.itemAlreadyExists(path))
                this.updateItem(path);
            else
                this.addNewItem(path);
        }
        finally {
            this.writeFavoritesToConfigFile();
        }
    }

    itemAlreadyExists(path) {
        for (let item of this.favorites)
            if (item.path === path)
                return true;

        return false;
    }

    addNewItem(path) {
        let newItem = {
            path: path,
            counter: 1
        }

        this.favorites.push(newItem);
    }

    updateItem(path) {
        for (let item of this.favorites)
            if (item.path === path)
                item.counter++;
    }

    getItems() {
        return this.favorites;
    }

    getFavoritesFromConfigFile() {
        return new ConfigManager().getConfig().history;
    }

    writeFavoritesToConfigFile() {
        let config = new ConfigManager().getConfig();
        config.history = this.favorites;
        new ConfigManager().saveConfig(config);
    }
}