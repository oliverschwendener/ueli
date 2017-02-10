import fs from 'fs'

import ConfigManager from './../ConfigManager'
let configManager = new ConfigManager()
let config = configManager.getConfig()

export default class Favorites {
    constructor() {
        this.favorites = config.favorites
    }

    addFavorite(filePath) {
        let itemAlreadyExists = false

        for (let favorite of this.favorites)
            if (favorite.path === filePath) {
                favorite.counter++  
                itemAlreadyExists = true
            }

        if (!itemAlreadyExists)
            this.favorites.push({
                path: filePath,
                counter: 1
            })

        config.favorites = this.favorites

        configManager.setConfig(config)
    }

    getFavorites() {
        return this.favorites
    }
    
}