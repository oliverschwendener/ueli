import open from 'open';
import fs from 'fs';
import Helpers from './Helpers';
import ConfigHelper from './ConfigHelper';

export default class WebSearchExecutor {
    constructor() {
        this.helpers = new Helpers();
        this.webSearches = this.getWebSearches();
    }

    isValid(userInput) {
        if (userInput.indexOf(':') < 0)
            return false;

        return this.getWebSearchByUserInput(userInput) !== undefined
            ? true
            : false;
    }

    execute(userInput) {
        let query = encodeURIComponent(userInput.split(':')[1]);
        let webSearch = this.getWebSearchByUserInput(userInput);

        open(`${webSearch.url}${query}`, (error) => {
            if (error) throw error;
        });
    }

    getWebSearches() {
        let userConfig = new ConfigHelper().getConfig();

        if (userConfig.webSearches !== undefined)
            return userConfig.webSearches;

        return [];
    }

    getInfoMessage(userInput) {
        let prefix = userInput.split(':')[0];
        let search = encodeURIComponent(userInput.split(':')[1]);

        let webSearch = this.getWebSearchByUserInput(userInput);
        let webSearchName = webSearch.name;
        let url = webSearch.url;

        return `<div>
                    <p class="result-name">${webSearchName} search</p>
                    <p class="result-description">${url}${search}</p>
                </div>`;
    }

    getIcon(userInput) {
        let webSearch = this.getWebSearchByUserInput(userInput);
        return webSearch.icon;
    }

    getWebSearchByUserInput(userInput) {
        let prefix = userInput.split(':')[0];

        for (let webSearch of this.webSearches)
            if (webSearch.prefix.toLowerCase() === prefix.toLowerCase())
                return webSearch;

        return undefined;
    }
}