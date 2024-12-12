import type { SearchResultItemAction } from "@common/Core";

/**
 * Creates an action to add the given SearchResultItem to the favorites by its ID.
 */
export const createAddToFavoritesAction = ({ id }: { id: string }): SearchResultItemAction => ({
    argument: JSON.stringify({ action: "Add", id }),
    description: "Add to favorites",
    descriptionTranslation: {
        key: "addToFavorites",
        namespace: "searchResultItemAction",
    },
    handlerId: "Favorites",
    fluentIcon: "StarRegular",
});
