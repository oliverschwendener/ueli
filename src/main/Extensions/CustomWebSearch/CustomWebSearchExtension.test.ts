import { createEmptyInstantSearchResult } from "@common/Core";
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
        {
            encodeSearchTerm: true,
            id: "00000000-0000-0000-0000-000000000003",
            name: "g",
            prefix: "g",
            url: "https://ueli.app/g/{{query}}",
        },
        {
            encodeSearchTerm: true,
            id: "00000000-0000-0000-0000-000000000004",
            name: "genius",
            prefix: "genius",
            url: "https://ueli.app/genius/{{query}}",
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

            expect(customWebSearch.getInstantSearchResultItems("1")).toEqual(createEmptyInstantSearchResult());
        });

        it("should return empty array when user input does not contain any prefix", () => {
            const getValueMock = vi.fn().mockReturnValue(getSearchEngineSettings(["wiki", "google"]));
            const settingsManager = <SettingsManager>{
                getValue: (k, d, s) => getValueMock(k, d, s),
            };
            const customWebSearch = new CustomWebSearchExtension(assetPathResolver, settingsManager, urlImageGenerator);

            expect(customWebSearch.getInstantSearchResultItems("1")).toEqual(createEmptyInstantSearchResult());
            expect(customWebSearch.getInstantSearchResultItems("test")).toEqual(createEmptyInstantSearchResult());
            expect(customWebSearch.getInstantSearchResultItems("wik test")).toEqual(createEmptyInstantSearchResult());
            expect(customWebSearch.getInstantSearchResultItems("gooooooogle test")).toEqual(
                createEmptyInstantSearchResult(),
            );
        });

        it("should replace query in search engine url", () => {
            const getValueMock = vi.fn().mockReturnValue(getSearchEngineSettings(["wiki", "google"]));
            const settingsManager = <SettingsManager>{
                getValue: (k, d, s) => getValueMock(k, d, s),
            };
            const customWebSearch = new CustomWebSearchExtension(assetPathResolver, settingsManager, urlImageGenerator);

            const { after, before } = customWebSearch.getInstantSearchResultItems("google?testinput");

            expect(before).toEqual([]);
            expect(after).toHaveLength(1);
            expect(after[0].defaultAction.handlerId).toEqual("Url");
            expect(after[0].defaultAction.argument).toEqual("https://ueli.app/google/testinput");
        });

        it("should trim spaces in search query input", () => {
            const getValueMock = vi.fn().mockReturnValue(getSearchEngineSettings(["wiki", "google"]));
            const settingsManager = <SettingsManager>{
                getValue: (k, d, s) => getValueMock(k, d, s),
            };
            const customWebSearch = new CustomWebSearchExtension(assetPathResolver, settingsManager, urlImageGenerator);

            const { after, before } = customWebSearch.getInstantSearchResultItems("wiki testinput");

            expect(before).toEqual([]);
            expect(after).toHaveLength(1);
            expect(after[0].defaultAction.handlerId).toEqual("Url");
            expect(after[0].defaultAction.argument).toEqual("https://ueli.app/wiki/testinput");
        });

        it("should only encode query, if setting is enabled", () => {
            const getValueMock = vi.fn().mockReturnValue(getSearchEngineSettings(["wiki", "google"]));
            const settingsManager = <SettingsManager>{
                getValue: (k, d, s) => getValueMock(k, d, s),
            };
            const customWebSearch = new CustomWebSearchExtension(assetPathResolver, settingsManager, urlImageGenerator);

            const resultsEnabled = customWebSearch.getInstantSearchResultItems("wikitest input");
            expect(resultsEnabled.before).toEqual([]);
            expect(resultsEnabled.after).toHaveLength(1);
            expect(resultsEnabled.after[0].defaultAction.handlerId).toEqual("Url");
            expect(resultsEnabled.after[0].defaultAction.argument).toEqual("https://ueli.app/wiki/test%20input");

            const resultsDisabled = customWebSearch.getInstantSearchResultItems("google?test input");
            expect(resultsDisabled.before).toEqual([]);
            expect(resultsDisabled.after).toHaveLength(1);
            expect(resultsDisabled.after[0].defaultAction.handlerId).toEqual("Url");
            expect(resultsDisabled.after[0].defaultAction.argument).toEqual("https://ueli.app/google/test input");
        });

        it("should replace query, even if it is part of the domain", () => {
            const getValueMock = vi.fn().mockReturnValue(getSearchEngineSettings(["domain", "google"]));
            const settingsManager = <SettingsManager>{
                getValue: (k, d, s) => getValueMock(k, d, s),
            };
            const customWebSearch = new CustomWebSearchExtension(assetPathResolver, settingsManager, urlImageGenerator);

            const { after, before } = customWebSearch.getInstantSearchResultItems("domain testinput");

            expect(before).toEqual([]);
            expect(after).toHaveLength(1);
            expect(after[0].defaultAction.handlerId).toEqual("Url");
            expect(after[0].defaultAction.argument).toEqual("https://testinput.ueli.app/test");
        });

        it("should allow multiple search results, when multiple search engines match", () => {
            const getValueMock = vi.fn().mockReturnValue(getSearchEngineSettings(["g", "genius"]));
            const settingsManager = <SettingsManager>{
                getValue: (k, d, s) => getValueMock(k, d, s),
            };
            const customWebSearch = new CustomWebSearchExtension(assetPathResolver, settingsManager, urlImageGenerator);

            const { after, before } = customWebSearch.getInstantSearchResultItems("genius testinput");

            expect(before).toEqual([]);
            expect(after).toHaveLength(2);
            expect(after[0].defaultAction.handlerId).toEqual("Url");
            expect(after[0].defaultAction.argument).toEqual("https://ueli.app/g/enius%20testinput");
            expect(after[1].defaultAction.handlerId).toEqual("Url");
            expect(after[1].defaultAction.argument).toEqual("https://ueli.app/genius/testinput");
        });
    });
});
