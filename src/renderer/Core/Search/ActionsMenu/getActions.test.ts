import { SearchResultItemActionUtility, type SearchResultItem, type SearchResultItemAction } from "@common/Core";
import { describe, expect, it } from "vitest";
import { getActions } from "./getActions";

describe(getActions, () => {
    it("should include an 'add to favorites' action when favorites don't include the current item", () => {
        const searchResultItem = <SearchResultItem>{
            id: "id1",
            defaultAction: {
                argument: "default action argument",
                handlerId: "default handler id",
            },
            additionalActions: [{ argument: "additional argument", handlerId: "additional handler id" }],
        };

        expect(getActions(searchResultItem, [])).toEqual(<SearchResultItemAction[]>[
            { argument: "default action argument", handlerId: "default handler id" },
            SearchResultItemActionUtility.createAddToFavoritesAction({ id: searchResultItem.id }),
            SearchResultItemActionUtility.createExcludeFromSearchResultsAction({ id: searchResultItem.id }),
            { argument: "additional argument", handlerId: "additional handler id" },
        ]);
    });

    it("should include a 'remove from favorites' action when favorites don't include the current item", () => {
        const searchResultItem = <SearchResultItem>{
            id: "id1",
            defaultAction: {
                argument: "default action argument",
                handlerId: "default handler id",
            },
        };

        expect(getActions(searchResultItem, ["id1"])).toEqual(<SearchResultItemAction[]>[
            { argument: "default action argument", handlerId: "default handler id" },
            SearchResultItemActionUtility.createRemoveFromFavoritesAction({ id: searchResultItem.id }),
            SearchResultItemActionUtility.createExcludeFromSearchResultsAction({ id: searchResultItem.id }),
        ]);
    });
});
