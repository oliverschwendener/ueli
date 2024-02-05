import type { ExcludedSearchResults } from "@Core/ExcludedSearchResults";
import type { SearchResultItemAction } from "@common/Core";
import type { ActionHandler } from "../Contract";

export class ExcludeFromSearchResultsActionHandler implements ActionHandler {
    public readonly id = "excludeFromSearchResults";

    public constructor(private readonly excludedSearchResults: ExcludedSearchResults) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        await this.excludedSearchResults.add(action.argument);
    }
}
