import open from 'open';
import fs from 'fs';
import Helpers from './Helpers.js';
import ConfigHelper from './ConfigHelper.js';

export default class WebSearchExecutor {
    constructor() {
        this.helpers = new Helpers();
        this.webSearches = this.getWebSearches();
    }

    isValid(query) {
        if (query.indexOf(':') < 0)
            return false;

        let prefix = query.split(':')[0];

        for (let search of this.webSearches) {
            if (prefix === search.prefix)
                return true;
        }

        return false;
    }

    execute(input) {
        let prefix = input.split(':')[0];
        let query = input.split(':')[1];
        query = this.helpers.splitStringToArray(query).join('+');

        for (let search of this.webSearches) {
            if (prefix === search.prefix) {
                open(`${search.url}${query}`, error => {
                    if (error) throw error;
                });
            }
        }
    }

    getWebSearches() {
        let userConfig = new ConfigHelper().getConfig();

        if (userConfig.webSearches !== undefined)
            return userConfig.webSearches;

        return [];
    }

    getInfoMessage(input) {
        let prefix = input.split(':')[0];
        let webSearchName = '';

        for (let webSearch of this.webSearches)
            if (webSearch.prefix === prefix)
                webSearchName = webSearch.name;

        return `${webSearchName} search`;
    }
}