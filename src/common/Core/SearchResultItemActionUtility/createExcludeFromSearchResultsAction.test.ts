import { type SearchResultItemAction, createExcludeFromSearchResultsAction } from "@common/Core";
import { describe, expect, it } from "vitest";

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
            keyboardShortcut: "Ctrl+Backspace",
        };

        expect(actual).toEqual(expected);
    });
});
