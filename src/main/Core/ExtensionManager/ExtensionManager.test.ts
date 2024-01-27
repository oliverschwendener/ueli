import type { Extension } from "@Core/Extension";
import type { ExtensionRegistry } from "@Core/ExtensionRegistry";
import type { Logger } from "@Core/Logger";
import type { SearchIndex } from "@Core/SearchIndex";
import type { SettingsManager } from "@Core/SettingsManager";
import type { SearchResultItem } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import { ExtensionManager } from "./ExtensionManager";

describe(ExtensionManager, () => {
    it("it should populate search index by extension id", async () => {
        const searchResultItems = [
            <SearchResultItem>{ id: "searchResultItem1" },
            <SearchResultItem>{ id: "searchResultItem2" },
            <SearchResultItem>{ id: "searchResultItem3" },
        ];

        const extension = <Extension>{
            id: "extension1",
            getSearchResultItems: () => Promise.resolve(searchResultItems),
        };

        const getExtensionByIdMock = vi.fn().mockReturnValue(extension);
        const addSearchResultItemsMock = vi.fn();

        const extensionRegistry = <ExtensionRegistry>{ getById: (extensionId) => getExtensionByIdMock(extensionId) };

        const searchIndex = <SearchIndex>{
            addSearchResultItems: (extensionId, searchResultItems) =>
                addSearchResultItemsMock(extensionId, searchResultItems),
        };

        const extensionManager = new ExtensionManager(extensionRegistry, searchIndex, <SettingsManager>{}, <Logger>{});

        await extensionManager.populateSearchIndexByExtensionId(extension.id);

        expect(getExtensionByIdMock).toHaveBeenCalledWith(extension.id);
        expect(addSearchResultItemsMock).toHaveBeenCalledWith(extension.id, searchResultItems);
    });

    it("should get the supported extensions", () => {
        const extension1 = <Extension>{ isSupported: () => true };
        const extension2 = <Extension>{ isSupported: () => false };
        const extension3 = <Extension>{ isSupported: () => false };

        const extensionRegistry = <ExtensionRegistry>{ getAll: () => [extension1, extension2, extension3] };

        const extensionManager = new ExtensionManager(
            extensionRegistry,
            <SearchIndex>{},
            <SettingsManager>{},
            <Logger>{},
        );

        expect(extensionManager.getSupportedExtensions()).toEqual([extension1]);
    });

    it("should get the enabled extensions", () => {
        const extension1 = <Extension>{ id: "extension1", isSupported: () => true };
        const extension2 = <Extension>{ id: "extension2", isSupported: () => true };
        const extension3 = <Extension>{ id: "extension3", isSupported: () => false };

        const extensionRegistry = <ExtensionRegistry>{ getAll: () => [extension1, extension2, extension3] };
        const getValueMock = vi.fn().mockReturnValue(["extension1"]);
        const settingsManager = <SettingsManager>{ getValue: (key, defaultValue) => getValueMock(key, defaultValue) };

        const extensionManager = new ExtensionManager(extensionRegistry, <SearchIndex>{}, settingsManager, <Logger>{});

        expect(extensionManager.getEnabledExtensions()).toEqual([extension1]);
    });
});
