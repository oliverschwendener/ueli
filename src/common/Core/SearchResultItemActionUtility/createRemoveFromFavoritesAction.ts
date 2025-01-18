import type { SearchResultItemAction } from "@common/Core";

/**
 * Creates an action to remove the given SearchResultItem from the favorites by its ID.
 */
export const createRemoveFromFavoritesAction = ({ id }: { id: string }): SearchResultItemAction => ({
    argument: JSON.stringify({ action: "Remove", id }),
    description: "Remove from favorites",
    descriptionTranslation: {
        key: "removeFromFavorites",
        namespace: "searchResultItemAction",
    },
    handlerId: "Favorites",
    fluentIcon: "StarOffRegular",
    keyboardShortcut: "Ctrl+f",
});
