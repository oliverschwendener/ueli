import { Searcher } from "./searcher";
import { SearchResultItem } from "../search-result-item";
import { IconSet } from "../icon-sets/icon-set";

export class EmailAddressSearcher implements Searcher {
    private iconSet: IconSet;

    constructor(iconSet: IconSet) {
        this.iconSet = iconSet;
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        return [
            {
                description: `Send an email to ${userInput}`,
                executionArgument: `mailto:${userInput}`,
                icon: this.iconSet.emailIcon,
                name: userInput,
                searchable: [],
                tags: [],
            } as SearchResultItem,
        ];
    }
}
