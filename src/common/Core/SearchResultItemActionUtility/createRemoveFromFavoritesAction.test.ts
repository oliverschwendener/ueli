import { describe, expect, it } from "vitest";
import type { SearchResultItemAction } from "../SearchResultItemAction";
import { createRemoveFromFavoritesAction } from "./createRemoveFromFavoritesAction";

describe(createRemoveFromFavoritesAction, () => {
    it("should create a 'remove from favorites' action", () => {
        const actual = createRemoveFromFavoritesAction({ id: "id_1" });

        const expected = <SearchResultItemAction>{
            argument: JSON.stringify({ action: "Remove", id: "id_1" }),
            description: "Remove from favorites",
            descriptionTranslation: {
                key: "removeFromFavorites",
                namespace: "searchResultItemAction",
            },
            handlerId: "Favorites",
            fluentIcon: "StarOffRegular",
        };

        expect(actual).toEqual(expected);
    });
});
