import type { ExcludedSearchResults } from "@Core/ExcludedSearchResults";
import type { ExcludedSearchResultItem, SearchResultItemAction } from "@common/Core";
import type { ActionHandler } from "../Contract";

export class ExcludeFromSearchResultsActionHandler implements ActionHandler {
    public readonly id = "excludeFromSearchResults";

    public constructor(private readonly excludedSearchResults: ExcludedSearchResults) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        const item = JSON.parse(action.argument) as ExcludedSearchResultItem;
        await this.excludedSearchResults.addItem(item);
    }
}
