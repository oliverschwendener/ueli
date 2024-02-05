import { SearchResultItemActionUtility, type SearchResultItem, type SearchResultItemAction } from "@common/Core";

export const getActions = (searchResultItem: SearchResultItem, favorites: string[]): SearchResultItemAction[] => {
    const defaultAdditionalActions = [
        favorites.includes(searchResultItem.id)
            ? SearchResultItemActionUtility.createRemoveFromFavoritesAction({ id: searchResultItem.id })
            : SearchResultItemActionUtility.createAddToFavoritesAction(searchResultItem),
        SearchResultItemActionUtility.createExcludeFromSearchResultsAction(searchResultItem),
    ];

    return [searchResultItem.defaultAction, ...defaultAdditionalActions, ...(searchResultItem.additionalActions ?? [])];
};
