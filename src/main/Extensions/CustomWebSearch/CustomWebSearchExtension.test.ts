import type { CustomSearchEngineSetting } from "@common/Extensions/CustomWebSearch";
import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { UrlImageGenerator } from "@Core/ImageGenerator/UrlImageGenerator";
import type { SettingsManager } from "@Core/SettingsManager";
import { describe, expect, it, vi } from "vitest";
import { CustomWebSearchExtension } from "./CustomWebSearchExtension";

const getSearchEngineSettings = (searchEngineNames: string[]): CustomSearchEngineSetting[] => {
    const customSearchEngines: CustomSearchEngineSetting[] = [
        {
            encodeSearchTerm: true,
            id: "00000000-0000-0000-0000-000000000000",
            name: "wiki",
            prefix: "wiki",
            url: "https://ueli.app/wiki/{{query}}",
        },
        {
            encodeSearchTerm: false,
            id: "00000000-0000-0000-0000-000000000001",
            name: "google",
            prefix: "google?",
            url: "https://ueli.app/google/{{query}}",
        },
        {
            encodeSearchTerm: true,
            id: "00000000-0000-0000-0000-000000000002",
            name: "domain",
            prefix: "domain",
            url: "https://{{query}}.ueli.app/test",
        },
    ];
    return customSearchEngines.filter((s) => searchEngineNames.includes(s.name));
};

describe(CustomWebSearchExtension, () => {
    describe(CustomWebSearchExtension.prototype.getInstantSearchResultItems, () => {
        const faviconPath = "/path/to/favicon";
        const imageFilePath = "/path/to/image";
        const getFaviconPathMock = vi.fn().mockReturnValue(faviconPath);
        const getExtensionAssetPathMock = vi.fn().mockReturnValue(imageFilePath);

        const assetPathResolver = <AssetPathResolver>{
            getExtensionAssetPath: (i, f) => getExtensionAssetPathMock(i, f),
        };
        const urlImageGenerator = <UrlImageGenerator>{
            getImage: (url) => getFaviconPathMock(url),
        };

        it("should not break, if no search engine is defined", () => {
            const getValueMock = vi.fn().mockReturnValue(getSearchEngineSettings([]));
            const settingsManager = <SettingsManager>{
                getValue: (k, d, s) => getValueMock(k, d, s),
            };
            const customWebSearch = new CustomWebSearchExtension(assetPathResolver, settingsManager, urlImageGenerator);

            expect(customWebSearch.getInstantSearchResultItems("1")).toEqual([]);
        });

        it("should return empty array when user input does not contain any prefix", () => {
            const getValueMock = vi.fn().mockReturnValue(getSearchEngineSettings(["wiki", "google"]));
            const settingsManager = <SettingsManager>{
                getValue: (k, d, s) => getValueMock(k, d, s),
            };
            const customWebSearch = new CustomWebSearchExtension(assetPathResolver, settingsManager, urlImageGenerator);

            expect(customWebSearch.getInstantSearchResultItems("1")).toEqual([]);
            expect(customWebSearch.getInstantSearchResultItems("test")).toEqual([]);
            expect(customWebSearch.getInstantSearchResultItems("wik test")).toEqual([]);
            expect(customWebSearch.getInstantSearchResultItems("gooooooogle test")).toEqual([]);
        });

        it("should replace query in search engine url", () => {
            const getValueMock = vi.fn().mockReturnValue(getSearchEngineSettings(["wiki", "google"]));
            const settingsManager = <SettingsManager>{
                getValue: (k, d, s) => getValueMock(k, d, s),
            };
            const customWebSearch = new CustomWebSearchExtension(assetPathResolver, settingsManager, urlImageGenerator);

            const results = customWebSearch.getInstantSearchResultItems("google?testinput");
            expect(results).toHaveLength(1);
            expect(results[0].defaultAction.handlerId).toEqual("Url");
            expect(results[0].defaultAction.argument).toEqual("https://ueli.app/google/testinput");
        });

        it("should trim spaces in search query input", () => {
            const getValueMock = vi.fn().mockReturnValue(getSearchEngineSettings(["wiki", "google"]));
            const settingsManager = <SettingsManager>{
                getValue: (k, d, s) => getValueMock(k, d, s),
            };
            const customWebSearch = new CustomWebSearchExtension(assetPathResolver, settingsManager, urlImageGenerator);

            const results = customWebSearch.getInstantSearchResultItems("wiki testinput");
            expect(results).toHaveLength(1);
            expect(results[0].defaultAction.handlerId).toEqual("Url");
            expect(results[0].defaultAction.argument).toEqual("https://ueli.app/wiki/testinput");
        });

        it("should only encode query, if setting is enabled", () => {
            const getValueMock = vi.fn().mockReturnValue(getSearchEngineSettings(["wiki", "google"]));
            const settingsManager = <SettingsManager>{
                getValue: (k, d, s) => getValueMock(k, d, s),
            };
            const customWebSearch = new CustomWebSearchExtension(assetPathResolver, settingsManager, urlImageGenerator);

            const resultsEnabled = customWebSearch.getInstantSearchResultItems("wikitest input");
            expect(resultsEnabled).toHaveLength(1);
            expect(resultsEnabled[0].defaultAction.handlerId).toEqual("Url");
            expect(resultsEnabled[0].defaultAction.argument).toEqual("https://ueli.app/wiki/test%20input");

            const resultsDisabled = customWebSearch.getInstantSearchResultItems("google?test input");
            expect(resultsDisabled).toHaveLength(1);
            expect(resultsDisabled[0].defaultAction.handlerId).toEqual("Url");
            expect(resultsDisabled[0].defaultAction.argument).toEqual("https://ueli.app/google/test input");
        });

        it("should replace query, even if it is part of the domain", () => {
            const getValueMock = vi.fn().mockReturnValue(getSearchEngineSettings(["domain", "google"]));
            const settingsManager = <SettingsManager>{
                getValue: (k, d, s) => getValueMock(k, d, s),
            };
            const customWebSearch = new CustomWebSearchExtension(assetPathResolver, settingsManager, urlImageGenerator);

            const results = customWebSearch.getInstantSearchResultItems("domain testinput");
            expect(results).toHaveLength(1);
            expect(results[0].defaultAction.handlerId).toEqual("Url");
            expect(results[0].defaultAction.argument).toEqual("https://testinput.ueli.app/test");
        });
    });
});
