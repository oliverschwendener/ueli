import { describe, expect, it } from "vitest";
import type { SearchResultItemAction } from "../SearchResultItemAction";
import { createOpenUrlSearchResultAction } from "./createOpenUrlSearchResultAction";

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
