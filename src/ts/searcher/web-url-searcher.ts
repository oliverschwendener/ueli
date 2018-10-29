import { SearchResultItem } from "../search-result-item";
import { Searcher } from "./searcher";
import { IconSet } from "../icon-sets/icon-set";

export class WebUrlSearcher implements Searcher {
    private readonly iconSet: IconSet;

    constructor(iconSet: IconSet) {
        this.iconSet = iconSet;
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        const url = userInput.startsWith("http://") || userInput.startsWith("https://")
            ? userInput
            : `http://${userInput}`;

        return [
            {
                description: "Open default web browser",
                executionArgument: url,
                icon: this.iconSet.urlIcon,
                name: url,
                searchable: [],
                tags: [],
            } as SearchResultItem,
        ];
    }
}
