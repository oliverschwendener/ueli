import { type SearchResultItemAction, createAddToFavoritesAction } from "@common/Core";
import { describe, expect, it } from "vitest";

describe(createAddToFavoritesAction, () => {
    it("should create an 'add to favorites' action", () => {
        const actual = createAddToFavoritesAction({ id: "id_1", keyboardShortcut: "keyboard-shortcut-1" });

        const expected = <SearchResultItemAction>{
            argument: JSON.stringify({ action: "Add", id: "id_1" }),
            description: "Add to favorites",
            descriptionTranslation: {
                key: "addToFavorites",
                namespace: "searchResultItemAction",
            },
            handlerId: "Favorites",
            fluentIcon: "StarRegular",
            keyboardShortcut: "keyboard-shortcut-1",
        };

        expect(actual).toEqual(expected);
    });
});
