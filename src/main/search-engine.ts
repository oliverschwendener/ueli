import { SearchResultItem } from "../common/search-result-item";
import { Plugin } from "./plugin";

export class SearchEngine {
    private readonly plugins: Plugin[];

    constructor(plugins: Plugin[]) {
        this.plugins = plugins;
    }

    public getSearchResults(userInput: string): SearchResultItem[] {
        let all: SearchResultItem[] = [];

        if (userInput === undefined || userInput.length === 0) {
            return all;
        }

        this.plugins.forEach((p) => {
            all = all.concat(p.getAll());
        });

        return all.filter((a) => {
            return a.name.toLowerCase().indexOf(userInput.toLowerCase()) > -1;
        });
    }
}
