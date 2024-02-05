import { describe, expect, it } from "vitest";
import type { ExcludedSearchResultItem } from "./ExcludedSearchResultItem";
import type { SearchResultItemAction } from "./SearchResultItemAction";
import { SearchResultItemActionUtility } from "./SearchResultItemActionUtility";

describe(SearchResultItemActionUtility, () => {
    describe(SearchResultItemActionUtility.createCopyToClipboardAction, () => {
        it("should create an 'add to favorites' action", () => {
            const actual = SearchResultItemActionUtility.createAddToFavoritesAction({ id: "id_1" });

            const expected = <SearchResultItemAction>{
                argument: JSON.stringify({ action: "Add", id: "id_1" }),
                description: "Add to favorites",
                descriptionTranslation: {
                    key: "addToFavorites",
                    namespace: "searchResultItemAction",
                },
                handlerId: "Favorites",
                hideWindowAfterInvocation: false,
                fluentIcon: "StarRegular",
            };

            expect(actual).toEqual(expected);
        });

        it("should create a 'remove from favorites' action", () => {
            const actual = SearchResultItemActionUtility.createRemoveFromFavoritesAction({ id: "id_1" });

            const expected = <SearchResultItemAction>{
                argument: JSON.stringify({ action: "Remove", id: "id_1" }),
                description: "Remove from favorites",
                descriptionTranslation: {
                    key: "removeFromFavorites",
                    namespace: "searchResultItemAction",
                },
                handlerId: "Favorites",
                hideWindowAfterInvocation: false,
                fluentIcon: "StarOffRegular",
            };

            expect(actual).toEqual(expected);
        });

        it("should create an 'copy to clipboard' action", () => {
            const actual = SearchResultItemActionUtility.createCopyToClipboardAction({
                description: "test description",
                textToCopy: "text to copy",
                descriptionTranslation: {
                    key: "translation key",
                    namespace: "translation namespace",
                },
            });

            const expected = <SearchResultItemAction>{
                argument: "text to copy",
                description: "test description",
                descriptionTranslation: {
                    key: "translation key",
                    namespace: "translation namespace",
                },
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
                descriptionTranslation: {
                    key: "excludeFromSearchResults",
                    namespace: "searchResultItemAction",
                },
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

    describe(SearchResultItemActionUtility.createOpenUrlSearchResultAction, () => {
        it("should create an 'open url' action", () => {
            const actual = SearchResultItemActionUtility.createOpenUrlSearchResultAction({ url: "this is an url" });

            const expected = <SearchResultItemAction>{
                argument: "this is an url",
                description: "Open URL in browser",
                descriptionTranslation: {
                    key: "openUrlInBrowser",
                    namespace: "searchResultItemAction",
                },
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
                descriptionTranslation: {
                    key: "showInFileExplorer",
                    namespace: "searchResultItemAction",
                },
                fluentIcon: "DocumentFolderRegular",
            };

            expect(actual).toEqual(expected);
        });
    });
});
