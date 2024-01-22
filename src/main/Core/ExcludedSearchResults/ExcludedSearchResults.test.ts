import type { EventEmitter } from "@Core/EventEmitter";
import type { SettingsManager } from "@Core/SettingsManager";
import { ExcludedSearchResultItem } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import { ExcludedSearchResults } from "./ExcludedSearchResults";

describe(ExcludedSearchResults, () => {
    it("should set the initial items from the settings manager", () => {
        const items = [
            <ExcludedSearchResultItem>{ id: "item1", name: "Item 1", imageUrl: "imageUrl1" },
            <ExcludedSearchResultItem>{ id: "item2", name: "Item 2", imageUrl: "imageUrl2" },
        ];

        const getValueMock = vi.fn().mockReturnValue(items);

        const eventEmitter = <EventEmitter>{};
        const settingsManager = <SettingsManager>{
            getValue: (key, defaultValue) => getValueMock(key, defaultValue),
        };

        expect(new ExcludedSearchResults(eventEmitter, settingsManager).getExcludedItems()).toEqual(items);
        expect(getValueMock).toHaveBeenCalledWith("searchEngine.excludedItems", []);
    });

    it("should add an item", async () => {
        const item = <ExcludedSearchResultItem>{ id: "item1", name: "Item 1", imageUrl: "imageUrl1" };

        const getValueMock = vi.fn().mockReturnValue([]);
        const updateValueMock = vi.fn().mockReturnValue(Promise.resolve());
        const emitEventMock = vi.fn();

        const eventEmitter = <EventEmitter>{
            emitEvent: (event) => emitEventMock(event),
        };

        const settingsManager = <SettingsManager>{
            getValue: (key, defaultValue) => getValueMock(key, defaultValue),
            updateValue: (key, value) => updateValueMock(key, value),
        };

        const excludedSearchResults = new ExcludedSearchResults(eventEmitter, settingsManager);

        await excludedSearchResults.addItem(item);

        expect(excludedSearchResults.getExcludedItems()).toEqual([item]);
        expect(updateValueMock).toHaveBeenCalledWith("searchEngine.excludedItems", [item]);
        expect(emitEventMock).toHaveBeenCalledWith("excludedSearchResultItemsUpdated");
    });

    it("should remove an item", async () => {
        const getValueMock = vi
            .fn()
            .mockReturnValue([<ExcludedSearchResultItem>{ id: "item1", name: "Item 1", imageUrl: "imageUrl1" }]);

        const updateValueMock = vi.fn().mockReturnValue(Promise.resolve());
        const emitEventMock = vi.fn();

        const eventEmitter = <EventEmitter>{
            emitEvent: (event) => emitEventMock(event),
        };

        const settingsManager = <SettingsManager>{
            getValue: (key, defaultValue) => getValueMock(key, defaultValue),
            updateValue: (key, value) => updateValueMock(key, value),
        };

        const excludedSearchResults = new ExcludedSearchResults(eventEmitter, settingsManager);

        await excludedSearchResults.removeItem("item1");

        expect(excludedSearchResults.getExcludedItems()).toEqual([]);
        expect(updateValueMock).toHaveBeenCalledWith("searchEngine.excludedItems", []);
        expect(emitEventMock).toHaveBeenCalledWith("excludedSearchResultItemsUpdated");
    });
});
