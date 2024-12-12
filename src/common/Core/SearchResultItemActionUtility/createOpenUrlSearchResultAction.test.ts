import { type SearchResultItemAction, createOpenUrlSearchResultAction } from "@common/Core";
import { describe, expect, it } from "vitest";

describe(createOpenUrlSearchResultAction, () => {
    it("should create an 'open url' action", () => {
        const actual = createOpenUrlSearchResultAction({ url: "this is an url" });

        const expected = <SearchResultItemAction>{
            argument: "this is an url",
            description: "Open URL in browser",
            descriptionTranslation: {
                key: "openUrlInBrowser",
                namespace: "searchResultItemAction",
            },
            handlerId: "Url",
            fluentIcon: "OpenRegular",
            hideWindowAfterInvocation: true,
        };

        expect(actual).toEqual(expected);
    });
});
