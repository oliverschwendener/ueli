import {
    createAddToFavoritesAction,
    createExcludeFromSearchResultsAction,
    createRemoveFromFavoritesAction,
    type SearchResultItem,
    type SearchResultItemAction,
} from "@common/Core";

export const getActions = (
    searchResultItem: SearchResultItem,
    favorites: string[],
    keyboardShortcuts: Record<"addToFavorites" | "excludeFromSearchResults", string>,
): SearchResultItemAction[] => {
    const defaultAdditionalActions = [
        favorites.includes(searchResultItem.id)
            ? createRemoveFromFavoritesAction({
                  id: searchResultItem.id,
                  keyboardShortcut: keyboardShortcuts.addToFavorites,
              })
            : createAddToFavoritesAction({
                  id: searchResultItem.id,
                  keyboardShortcut: keyboardShortcuts.addToFavorites,
              }),
        createExcludeFromSearchResultsAction({
            id: searchResultItem.id,
            keyboardShortcut: keyboardShortcuts.excludeFromSearchResults,
        }),
    ];

    return [
        { ...searchResultItem.defaultAction, keyboardShortcut: "Enter" },
        ...(searchResultItem.additionalActions ?? []),
        ...defaultAdditionalActions,
    ];
};
