import { describe, expect, it } from "vitest";
import type { SearchResultItemAction } from "../SearchResultItemAction";
import { createShowItemInFileExplorerAction } from "./createShowItemInFileExplorerAction";

describe(createShowItemInFileExplorerAction, () => {
    it("should create an 'show item in file explorer' action", () => {
        const actual = createShowItemInFileExplorerAction({
            filePath: "this is a file path",
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
        };

        expect(actual).toEqual(expected);
    });
});
