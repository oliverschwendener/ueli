import { type SearchResultItemAction, createShowItemInFileExplorerAction } from "@common/Core";
import { describe, expect, it } from "vitest";

describe(createShowItemInFileExplorerAction, () => {
    it("should create an 'show item in file explorer' action", () => {
        const actual = createShowItemInFileExplorerAction({
            filePath: "this is a file path",
            keyboardShortcut: "test keyboard shortcut",
        });

        const expected = <SearchResultItemAction>{
            argument: "this is a file path",
            description: "Show in file explorer",
            handlerId: "ShowItemInFileExplorer",
            descriptionTranslation: {
                key: "showInFileExplorer",
                namespace: "searchResultItemAction",
            },
            fluentIcon: "DocumentFolderRegular",
            hideWindowAfterInvocation: true,
            keyboardShortcut: "test keyboard shortcut",
        };

        expect(actual).toEqual(expected);
    });
});
