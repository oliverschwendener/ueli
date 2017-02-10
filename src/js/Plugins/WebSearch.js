import open from 'open'
import ConfigManager from './../ConfigManager'

export default class WebSearch {
    constructor() {
        this.webSearches = new ConfigManager().getConfig().webSearches
    }

    isValid(userInput) {
        for (let search of this.webSearches)
            if (userInput.startsWith(`${search.prefix}:`))
                return true

        return false
    }

    execute(url) {
        open(url)
    }

    getSearchResult(userInput) {
        for (let search of this.webSearches)
            if (userInput.startsWith(`${search.prefix}:`)) {
                userInput = userInput.replace(`${search.prefix}:`, '')
                userInput = encodeURIComponent(userInput)
                return [{
                    name: `${search.name} search`,
                    execArg: `${search.url}${userInput}`
                }]
            }
    }
}