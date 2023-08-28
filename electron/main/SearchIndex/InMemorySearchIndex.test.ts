import { SearchResultItem } from "@common/SearchResultItem";
import { describe, expect, it } from "vitest";
import { EventEmitter } from "../EventEmitter";
import { InMemorySearchIndex } from "./InMemorySearchIndex";

describe(InMemorySearchIndex, () => {
    it("should return an empty list of search result items if the search index is empty", () => {
        const emittedEvents: string[] = [];

        const eventEmitter = <EventEmitter>{
            emitEvent: (event) => {
                emittedEvents.push(event);
            },
        };

        expect(new InMemorySearchIndex(eventEmitter).getSearchResultItems()).toEqual([]);
        expect(emittedEvents.length).toBe(0);
    });

    it("should return all search result items if the search index is not empty", () => {
        const emittedEvents: string[] = [];

        const searchResultItems: SearchResultItem[] = [
            { description: "item1", id: "item1", name: "item1" },
            { description: "item2", id: "item2", name: "item2" },
            { description: "item3", id: "item3", name: "item3" },
        ];

        const eventEmitter = <EventEmitter>{
            emitEvent: (event) => {
                emittedEvents.push(event);
            },
        };

        const searchIndex = new InMemorySearchIndex(eventEmitter);
        searchIndex.addSearchResultItems("testPluginId", searchResultItems);

        expect(searchIndex.getSearchResultItems()).toEqual(searchResultItems);
        expect(emittedEvents.length).toBe(1);
    });
});
