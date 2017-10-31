import fs from 'fs'

import ConfigManager from './ConfigManager'

export default class FavoritesManager {
    constructor() {
        this.favorites = new ConfigManager().getConfig().favorites
    }

    addFavorite(filePath) {
        this.favorites = new ConfigManager().getConfig().favorites

        let itemAlreadyExists = false

        for (let favorite of this.favorites)
            if (favorite.path === filePath) {
                itemAlreadyExists = true
                favorite.counter++
            }

        if (!itemAlreadyExists)
            this.favorites.push({
                path: filePath,
                counter: 1
            })

        let config = new ConfigManager().getConfig()
        config.favorites = getSortedFavorites(this.favorites)
        configManager.setConfig(config)
    }

    getFavorites() {
        return getSortedFavorites(this.favorites)
    }
}

function getSortedFavorites(favorites) {
    let sortedFavorites = favorites.sort((a, b) => {
        if (a.counter < b.counter) return 1
        if (a.counter > b.counter) return -1
        return 0
    })

    return sortedFavorites
}