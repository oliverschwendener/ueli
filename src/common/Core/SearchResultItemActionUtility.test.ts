import { describe, expect, it } from "vitest";
import type { ExcludedSearchResultItem } from "./ExcludedSearchResultItem";
import type { SearchResultItemAction } from "./SearchResultItemAction";
import { SearchResultItemActionUtility } from "./SearchResultItemActionUtility";

describe(SearchResultItemActionUtility, () => {
    describe(SearchResultItemActionUtility.createCopyToClipboardAction, () => {
        it("should create an 'copy to clipboard' action", () => {
            const actual = SearchResultItemActionUtility.createCopyToClipboardAction({
                description: "test description",
                textToCopy: "text to copy",
                descriptionTranslationKey: "translation key",
            });

            const expected = <SearchResultItemAction>{
                argument: "text to copy",
                description: "test description",
                descriptionTranslationKey: "translation key",
                fluentIcon: "CopyRegular",
                handlerId: "copyToClipboard",
                hideWindowAfterInvocation: false,
            };

            expect(actual).toEqual(expected);
        });
    });

    describe(SearchResultItemActionUtility.createExcludeFromSearchResultsAction, () => {
        it("should create an 'exclude from search results' action", () => {
            const actual = SearchResultItemActionUtility.createExcludeFromSearchResultsAction({
                id: "test id",
                name: "test name",
                imageUrl: "image url",
            });

            const expected = <SearchResultItemAction>{
                argument: JSON.stringify(<ExcludedSearchResultItem>{
                    id: "test id",
                    name: "test name",
                    imageUrl: "image url",
                }),
                description: "Exclude from search results",
                descriptionTranslationKey: "searchResultItem.action.excludeFromSearchResults",
                fluentIcon: "EyeOffRegular",
                handlerId: "excludeFromSearchResults",
                hideWindowAfterInvocation: false,
            };

            expect(actual).toEqual(expected);
        });
    });

    describe(SearchResultItemActionUtility.createOpenFileAction, () => {
        it("should create an 'open file' action", () => {
            const actual = SearchResultItemActionUtility.createOpenFileAction({
                description: "test description",
                filePath: "test file path",
                descriptionTranslationKey: "test translation key",
            });

            const expected = <SearchResultItemAction>{
                argument: "test file path",
                description: "test description",
                descriptionTranslationKey: "test translation key",
                handlerId: "OpenFilePath",
                fluentIcon: "OpenRegular",
                hideWindowAfterInvocation: true,
            };

            expect(actual).toEqual(expected);
        });
    });

    describe(SearchResultItemActionUtility.createOpenUrlSearchResultAction, () => {
        it("should create an 'open url' action", () => {
            const actual = SearchResultItemActionUtility.createOpenUrlSearchResultAction({ url: "this is an url" });

            const expected = <SearchResultItemAction>{
                argument: "this is an url",
                description: "Open URL in browser",
                descriptionTranslationKey: "searchResultItem.action.openUrlInBrowser",
                handlerId: "Url",
                hideWindowAfterInvocation: true,
                fluentIcon: "OpenRegular",
            };

            expect(actual).toEqual(expected);
        });
    });

    describe(SearchResultItemActionUtility.createShowItemInFileExplorerAction, () => {
        it("should create an 'show item in file explorer' action", () => {
            const actual = SearchResultItemActionUtility.createShowItemInFileExplorerAction({
                filePath: "this is a file path",
            });

            const expected = <SearchResultItemAction>{
                argument: "this is a file path",
                description: "Show in file explorer",
                handlerId: "ShowItemInFileExplorer",
                hideWindowAfterInvocation: true,
                descriptionTranslationKey: "searchResultItem.action.showInFileExplorer",
                fluentIcon: "DocumentFolderRegular",
            };

            expect(actual).toEqual(expected);
        });
    });
});
