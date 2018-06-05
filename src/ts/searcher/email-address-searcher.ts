import { Searcher } from "./searcher";
import { SearchResultItem } from "../search-result-item";
import { Injector } from "../injector";
import { IconSet } from "../icon-sets/icon-set";
import { platform } from "os";

export class EmailAddressSearcher implements Searcher {
    private iconSet: IconSet;

    constructor() {
        this.iconSet = Injector.getIconSet(platform());
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        return [
            {
                executionArgument: `mailto:${userInput}`,
                icon: this.iconSet.emailIcon,
                name: `Send an email to ${userInput}`,
                tags: [],
            } as SearchResultItem,
        ];
    }
}
