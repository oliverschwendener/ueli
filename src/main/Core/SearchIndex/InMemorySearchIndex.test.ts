import type { BrowserWindowNotifier } from "@Core/BrowserWindowNotifier";
import type { SearchResultItem } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import { InMemorySearchIndex } from "./InMemorySearchIndex";

describe(InMemorySearchIndex, () => {
    it("should return an empty list of search result items if the search index is empty", () => {
        const searchIndex = new InMemorySearchIndex(<BrowserWindowNotifier>{});

        searchIndex.setIndex({});

        expect(searchIndex.getSearchResultItems()).toEqual([]);
    });

    it("should return all search result items if the search index is not empty", () => {
        const searchResultItems: SearchResultItem[] = [
            <SearchResultItem>{ description: "item1", id: "item1", name: "item1" },
            <SearchResultItem>{ description: "item2", id: "item2", name: "item2" },
            <SearchResultItem>{ description: "item3", id: "item3", name: "item3" },
        ];

        const searchIndex = new InMemorySearchIndex(<BrowserWindowNotifier>{});

        searchIndex.setIndex({ testExtensionId: searchResultItems });

        expect(searchIndex.getSearchResultItems()).toEqual(searchResultItems);
    });

    it("should add search result items to the index with the extension id as a key and emit an event", () => {
        const notifyAllMock = vi.fn();
        const eventEmitter = <BrowserWindowNotifier>{ notifyAll: (a) => notifyAllMock(a) };

        const searchResultItems: SearchResultItem[] = [
            <SearchResultItem>{ description: "item1", id: "item1", name: "item1" },
            <SearchResultItem>{ description: "item2", id: "item2", name: "item2" },
            <SearchResultItem>{ description: "item3", id: "item3", name: "item3" },
        ];

        const searchIndex = new InMemorySearchIndex(eventEmitter);

        searchIndex.addSearchResultItems("extensionId1", searchResultItems);

        expect(searchIndex.getIndex()).toEqual({ extensionId1: searchResultItems });
        expect(notifyAllMock).toHaveBeenCalledWith({ channel: "searchIndexUpdated" });
    });

    it("should delete the key from the index and emit an event when removing search result items by extension id", () => {
        const notifyAllMock = vi.fn();
        const eventEmitter = <BrowserWindowNotifier>{ notifyAll: (a) => notifyAllMock(a) };

        const searchIndex = new InMemorySearchIndex(eventEmitter);

        searchIndex.setIndex({
            extensionId1: [
                <SearchResultItem>{ description: "item1", id: "item1", name: "item1" },
                <SearchResultItem>{ description: "item2", id: "item2", name: "item2" },
                <SearchResultItem>{ description: "item3", id: "item3", name: "item3" },
            ],
        });

        searchIndex.removeSearchResultItems("extensionId1");

        expect(searchIndex.getIndex()).toEqual({});
        expect(notifyAllMock).toHaveBeenCalledWith({ channel: "searchIndexUpdated" });
    });
});
