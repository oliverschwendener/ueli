import type { SearchResultItemAction } from "@shared/Core";

/**
 * Creates an action to remove the given SearchResultItem from the favorites by its ID.
 */
export const createRemoveFromFavoritesAction = ({
    id,
    keyboardShortcut,
}: {
    id: string;
    keyboardShortcut?: string;
}): SearchResultItemAction => ({
    argument: JSON.stringify({ action: "Remove", id }),
    description: "Remove from favorites",
    descriptionTranslation: {
        key: "removeFromFavorites",
        namespace: "searchResultItemAction",
    },
    handlerId: "Favorites",
    fluentIcon: "StarOffRegular",
    keyboardShortcut,
});
