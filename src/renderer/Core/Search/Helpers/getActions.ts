import {
    createAddToFavoritesAction,
    createExcludeFromSearchResultsAction,
    createRemoveFromFavoritesAction,
    type SearchResultItem,
    type SearchResultItemAction,
} from "@common/Core";

export const getActions = (searchResultItem: SearchResultItem, favorites: string[]): SearchResultItemAction[] => {
    const defaultAdditionalActions = [
        favorites.includes(searchResultItem.id)
            ? createRemoveFromFavoritesAction({ id: searchResultItem.id })
            : createAddToFavoritesAction(searchResultItem),
        createExcludeFromSearchResultsAction(searchResultItem),
    ];

    return [
        { ...searchResultItem.defaultAction, keyboardShortcut: "Enter" },
        ...(searchResultItem.additionalActions ?? []),
        ...defaultAdditionalActions,
    ];
};
