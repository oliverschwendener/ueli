import { Searcher } from "./searcher";
import { SearchResultItem } from "../search-result-item";
import { Injector } from "../injector";
import { IconManager } from "../icon-manager/icon-manager";

export class EmailAddressSearcher implements Searcher {
    private iconManager: IconManager;

    constructor() {
        this.iconManager = Injector.getIconManager();
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        return [
            {
                executionArgument: `mailto:${userInput}`,
                icon: this.iconManager.getEmailIcon(),
                name: `Send an email to ${userInput}`,
                tags: [],
            } as SearchResultItem,
        ];
    }
}
