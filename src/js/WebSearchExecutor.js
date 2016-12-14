import open from 'open';
import Helpers from './Helpers.js';

export default class WebSearchExecutor {
    constructor() {
        this.helpers = new Helpers();
        this.webSearches = [
            {
                "name": "Google",
                "prefix": "g",
                "url": "https://google.com/search?q=",
                "fontAwesomeIconClass": "fa-google"
            },
            {
                "name": "Wikipedia",
                "prefix": "w",
                "url": "https://wikipedia.org/w/?search=",
                "fontAwesomeIconClass": "fa-wikipedia-w"
            },
            {
                "name": "YouTube",
                "prefix": "yt",
                "url": "https://youtube.com/results?search_query=",
                "fontAwesomeIconClass": "fa-youtube"
            },
            {
                "name": "DuckDuckGo",
                "prefix": "d",
                "url": "https://duckduckgo.com/?q="
            }
        ]
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
}