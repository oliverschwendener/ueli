import type { SearchResultItem } from "@common/Core";
import type { BrowserWindowNotifier } from "@Core/BrowserWindowNotifier";
import type { Logger } from "@Core/Logger";
import { describe, expect, it, vi } from "vitest";

import type { Index } from "./Contract";
import type { SearchIndexFile } from "./Contract/SearchIndexFile";
import { SearchIndex } from "./SearchIndex";

describe(SearchIndex, () => {
    const searchIndexFileDummy = ({ index, exists }: { index: Index; exists?: boolean }) => {
        const writeMock = vi.fn();

        const searchIndexFile = new (class implements SearchIndexFile {
            public getPath(): string {
                return "dummypath";
            }

            public exists(): boolean {
                return exists ?? false;
            }

            public read(): Index {
                return index;
            }

            public write(index: Index): void {
                writeMock(index);
            }
        })();

        return { searchIndexFile, writeMock };
    };

    describe(SearchIndex.constructor, () => {
        it("should read the index from the file", () => {
            const index: Index = {
                extension17: [<SearchResultItem>{ name: "item1", id: "item1", description: "item1" }],
                extension33: [<SearchResultItem>{ name: "item2", id: "item2", description: "item2" }],
            };

            const { searchIndexFile } = searchIndexFileDummy({ index });

            const logger = <Logger>{};

            const searchIndex = new SearchIndex(<BrowserWindowNotifier>{}, searchIndexFile, logger);

            expect(searchIndex["index"]).toEqual(index);
        });

        it("should fall back to empty index and log error if reading the index file fails", () => {
            const browserWindowNotifier = <BrowserWindowNotifier>{};

            const searchIndexFile = new (class implements SearchIndexFile {
                public getPath(): string {
                    return "";
                }

                public exists(): boolean {
                    return true;
                }

                public read(): Index {
                    throw new Error("read error");
                }

                public write(_index: Index): void {
                    console.log("write", _index);
                }
            })();

            const loggerErrorMock = vi.fn();

            const logger = <Logger>{
                error: (message: string) => loggerErrorMock(message),
            };

            const searchIndex = new SearchIndex(browserWindowNotifier, searchIndexFile, logger);

            expect(searchIndex["index"]).toEqual({});
            expect(loggerErrorMock).toHaveBeenCalledWith(
                "Unable to read index file, falling back to empty index. Reason: read error",
            );
        });
    });

    describe(SearchIndex.prototype.set, () => {
        it("should replace the current index", () => {
            const { searchIndexFile, writeMock } = searchIndexFileDummy({
                index: {
                    extensionId1: [
                        <SearchResultItem>{ description: "item1", id: "item1", name: "item1" },
                        <SearchResultItem>{ description: "item2", id: "item2", name: "item2" },
                        <SearchResultItem>{ description: "item3", id: "item3", name: "item3" },
                    ],
                },
            });

            const notifyAllMock = vi.fn();
            const browserWindowNotifier = <BrowserWindowNotifier>{ notifyAll: (c) => notifyAllMock(c) };

            const logger = <Logger>{};

            const searchIndex = new SearchIndex(browserWindowNotifier, searchIndexFile, logger);

            const newIndex: Index = {
                extensionId2: [
                    <SearchResultItem>{ description: "item4", id: "item4", name: "item4" },
                    <SearchResultItem>{ description: "item5", id: "item5", name: "item5" },
                    <SearchResultItem>{ description: "item6", id: "item6", name: "item6" },
                ],
            };

            searchIndex.set(newIndex);

            expect(searchIndex["index"]).toEqual(newIndex);
            expect(writeMock).toHaveBeenCalledWith(newIndex);
            expect(notifyAllMock).toHaveBeenCalledWith({ channel: "searchIndexUpdated" });
        });
    });

    describe(SearchIndex.prototype.getSearchResultItems, () => {
        it("should return an empty list of search result items if the search index is empty", () => {
            const { searchIndexFile } = searchIndexFileDummy({ index: {} });
            const logger = <Logger>{};
            const searchIndex = new SearchIndex(<BrowserWindowNotifier>{}, searchIndexFile, logger);
            expect(searchIndex.getSearchResultItems()).toEqual([]);
        });

        it("should return all search result items if the search index is not empty", () => {
            const searchResultItems: SearchResultItem[] = [
                <SearchResultItem>{ description: "item1", id: "item1", name: "item1" },
                <SearchResultItem>{ description: "item2", id: "item2", name: "item2" },
                <SearchResultItem>{ description: "item3", id: "item3", name: "item3" },
            ];

            const { searchIndexFile } = searchIndexFileDummy({ index: { testExtensionId: searchResultItems } });

            const logger = <Logger>{};

            const searchIndex = new SearchIndex(<BrowserWindowNotifier>{}, searchIndexFile, logger);

            expect(searchIndex.getSearchResultItems()).toEqual(searchResultItems);
        });
    });

    describe(SearchIndex.prototype.addSearchResultItems, () => {
        it("should add search result items to the index with the extension id as a key and emit an event", () => {
            const notifyAllMock = vi.fn();
            const eventEmitter = <BrowserWindowNotifier>{ notifyAll: (a) => notifyAllMock(a) };

            const searchResultItems: SearchResultItem[] = [
                <SearchResultItem>{ description: "item1", id: "item1", name: "item1" },
                <SearchResultItem>{ description: "item2", id: "item2", name: "item2" },
                <SearchResultItem>{ description: "item3", id: "item3", name: "item3" },
            ];

            const { searchIndexFile, writeMock } = searchIndexFileDummy({ index: {} });

            const logger = <Logger>{};

            const searchIndex = new SearchIndex(eventEmitter, searchIndexFile, logger);

            searchIndex.addSearchResultItems("extensionId1", searchResultItems);

            expect(searchIndex["index"]).toEqual({ extensionId1: searchResultItems });
            expect(writeMock).toHaveBeenCalledWith({ extensionId1: searchResultItems });
            expect(notifyAllMock).toHaveBeenCalledWith({ channel: "searchIndexUpdated" });
        });
    });

    describe(SearchIndex.prototype.removeSearchResultItems, () => {
        it("should delete the key from the index and emit an event when removing search result items by extension id", () => {
            const notifyAllMock = vi.fn();
            const eventEmitter = <BrowserWindowNotifier>{ notifyAll: (a) => notifyAllMock(a) };

            const { searchIndexFile, writeMock } = searchIndexFileDummy({
                index: {
                    extensionId1: [
                        <SearchResultItem>{ description: "item1", id: "item1", name: "item1" },
                        <SearchResultItem>{ description: "item2", id: "item2", name: "item2" },
                        <SearchResultItem>{ description: "item3", id: "item3", name: "item3" },
                    ],
                },
            });

            const logger = <Logger>{};

            const searchIndex = new SearchIndex(eventEmitter, searchIndexFile, logger);

            searchIndex.removeSearchResultItems("extensionId1");

            expect(searchIndex["index"]).toEqual({});
            expect(writeMock).toHaveBeenCalledWith({});
            expect(notifyAllMock).toHaveBeenCalledWith({ channel: "searchIndexUpdated" });
        });
    });
});
