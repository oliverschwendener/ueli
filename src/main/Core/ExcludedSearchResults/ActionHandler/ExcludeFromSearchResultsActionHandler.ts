import type { ActionHandler } from "@Core/ActionHandler";
import type { SearchResultItemAction } from "@common/Core";
import type { ExcludedSearchResults } from "../ExcludedSearchResults";

/**
 * Action handler for excluding a search result from the search results.
 */
export class ExcludeFromSearchResultsActionHandler implements ActionHandler {
    public readonly id = "excludeFromSearchResults";

    public constructor(private readonly excludedSearchResults: ExcludedSearchResults) {}

    /**
     * Excludes an item from the search results.
     * Expects the given action's argument to be a SearchResultItem ID as a string.
     */
    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        await this.excludedSearchResults.add(action.argument);
    }
}
