import type { SearchResultItemAction } from "../SearchResultItemAction";

/**
 * Creates an action to exclude the given SearchResultItem from the search results by its ID.
 */
export const createExcludeFromSearchResultsAction = ({ id }: { id: string }): SearchResultItemAction => ({
    argument: id,
    description: "Exclude from search results",
    descriptionTranslation: {
        key: "excludeFromSearchResults",
        namespace: "searchResultItemAction",
    },
    handlerId: "excludeFromSearchResults",
    fluentIcon: "EyeOffRegular",
});
