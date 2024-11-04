import { describe, expect, it } from "vitest";
import type { SearchResultItemAction } from "../SearchResultItemAction";
import { createExcludeFromSearchResultsAction } from "./createExcludeFromSearchResultsAction";

describe(createExcludeFromSearchResultsAction, () => {
    it("should create an 'exclude from search results' action", () => {
        const actual = createExcludeFromSearchResultsAction({ id: "test id" });

        const expected = <SearchResultItemAction>{
            argument: "test id",
            description: "Exclude from search results",
            descriptionTranslation: {
                key: "excludeFromSearchResults",
                namespace: "searchResultItemAction",
            },
            fluentIcon: "EyeOffRegular",
            handlerId: "excludeFromSearchResults",
        };

        expect(actual).toEqual(expected);
    });
});
