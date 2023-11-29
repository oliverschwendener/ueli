import type { SearchResultItem } from "@common/SearchResultItem";
import { describe, expect, it, vi } from "vitest";
import type { EventEmitter } from "../EventEmitter";
import { InMemorySearchIndex } from "./InMemorySearchIndex";

describe(InMemorySearchIndex, () => {
    it("should return an empty list of search result items if the search index is empty", () => {
        const searchIndex = new InMemorySearchIndex(<EventEmitter>{});

        searchIndex.setIndex({});

        expect(searchIndex.getSearchResultItems()).toEqual([]);
    });

    it("should return all search result items if the search index is not empty", () => {
        const searchResultItems: SearchResultItem[] = [
            <SearchResultItem>{ description: "item1", id: "item1", name: "item1" },
            <SearchResultItem>{ description: "item2", id: "item2", name: "item2" },
            <SearchResultItem>{ description: "item3", id: "item3", name: "item3" },
        ];

        const searchIndex = new InMemorySearchIndex(<EventEmitter>{});

        searchIndex.setIndex({ testExtensionId: searchResultItems });

        expect(searchIndex.getSearchResultItems()).toEqual(searchResultItems);
    });

    it("should add search result items to the index with the extension id as a key and emit an event", () => {
        const emitEventMock = vi.fn();

        const eventEmitter = <EventEmitter>{
            emitEvent: (eventName) => emitEventMock(eventName),
        };

        const searchResultItems: SearchResultItem[] = [
            <SearchResultItem>{ description: "item1", id: "item1", name: "item1" },
            <SearchResultItem>{ description: "item2", id: "item2", name: "item2" },
            <SearchResultItem>{ description: "item3", id: "item3", name: "item3" },
        ];

        const searchIndex = new InMemorySearchIndex(eventEmitter);

        searchIndex.addSearchResultItems("extensionId1", searchResultItems);

        expect(searchIndex.getIndex()).toEqual({ extensionId1: searchResultItems });
        expect(emitEventMock).toHaveBeenCalledWith("searchIndexUpdated");
    });

    it("should delete the key from the index and emit an event when removing search result items by extension id", () => {
        const emitEventMock = vi.fn();

        const eventEmitter = <EventEmitter>{
            emitEvent: (eventName) => emitEventMock(eventName),
        };

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
        expect(emitEventMock).toHaveBeenCalledWith("searchIndexUpdated");
    });
});
