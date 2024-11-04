import { describe, expect, it } from "vitest";
import type { SearchResultItemAction } from "../SearchResultItemAction";
import { createOpenFileAction } from "./createOpenFileAction";

describe(createOpenFileAction, () => {
    it("should create an 'open file' action", () => {
        const actual = createOpenFileAction({
            description: "test description",
            filePath: "test file path",
            descriptionTranslation: {
                key: "test translation key",
                namespace: "test namespace",
            },
        });

        const expected = <SearchResultItemAction>{
            argument: "test file path",
            description: "test description",
            descriptionTranslation: {
                key: "test translation key",
                namespace: "test namespace",
            },
            handlerId: "OpenFilePath",
            fluentIcon: "OpenRegular",
            hideWindowAfterInvocation: true,
        };

        expect(actual).toEqual(expected);
    });
});
