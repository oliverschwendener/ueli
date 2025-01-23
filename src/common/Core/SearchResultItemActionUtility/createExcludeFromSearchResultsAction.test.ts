import { type SearchResultItemAction, createExcludeFromSearchResultsAction } from "@common/Core";
import { describe, expect, it } from "vitest";

describe(createExcludeFromSearchResultsAction, () => {
    it("should create an 'exclude from search results' action", () => {
        const actual = createExcludeFromSearchResultsAction({
            id: "test id",
            keyboardShortcut: "test-keyboard-shortcut",
        });

        const expected = <SearchResultItemAction>{
            argument: "test id",
            description: "Exclude from search results",
            descriptionTranslation: {
                key: "excludeFromSearchResults",
                namespace: "searchResultItemAction",
            },
            fluentIcon: "EyeOffRegular",
            handlerId: "excludeFromSearchResults",
            keyboardShortcut: "test-keyboard-shortcut",
        };

        expect(actual).toEqual(expected);
    });
});
