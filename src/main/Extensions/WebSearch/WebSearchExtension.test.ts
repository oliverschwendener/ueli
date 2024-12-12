import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { SettingsManager } from "@Core/SettingsManager";
import {
    createEmptyInstantSearchResult,
    createInvokeExtensionAction,
    createOpenUrlSearchResultAction,
    type SearchResultItem,
} from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import { describe, expect, it, vi } from "vitest";
import type { Suggestion } from "./Suggestion";
import type { WebSearchEngine } from "./WebSearchEngine";
import { WebSearchExtension } from "./WebSearchExtension";

describe(WebSearchExtension, () => {
    it("should return no instant search result items when search term is empty or whitespace", () => {
        const getValueMock = vi.fn().mockReturnValue(true);
        const webSearchExtension = new WebSearchExtension(
            <AssetPathResolver>{},
            <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) },
            [],
        );

        expect(webSearchExtension.getInstantSearchResultItems("")).toEqual(createEmptyInstantSearchResult());
        expect(webSearchExtension.getInstantSearchResultItems(" ")).toEqual(createEmptyInstantSearchResult());

        expect(getValueMock).toHaveBeenCalledWith(
            getExtensionSettingKey("WebSearch", "showInstantSearchResult"),
            false,
        );
    });

    it("should return no instant search result items when instant search result items are disabled", () => {
        const getValueMock = vi.fn().mockReturnValue(false);

        const webSearchExtension = new WebSearchExtension(
            <AssetPathResolver>{},
            <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) },
            [],
        );

        expect(webSearchExtension.getInstantSearchResultItems("blub")).toEqual(createEmptyInstantSearchResult());

        expect(getValueMock).toHaveBeenCalledWith(
            getExtensionSettingKey("WebSearch", "showInstantSearchResult"),
            false,
        );
    });

    it("should return one instant search result item when search term is not empty", () => {
        const getSearchUrlMock = vi.fn().mockReturnValue("mySearchUrl");

        const webSearchEngine = <WebSearchEngine>{
            getName: () => "searchEngine1",
            getSearchUrl: (s, l) => getSearchUrlMock(s, l),
            getImageFileName: () => "imageFileName",
        };

        const getWebSearchEngineMock = vi.fn().mockReturnValue("searchEngine1");
        const getLocaleMock = vi.fn().mockReturnValue("de-CH");
        const getShowInstantSearchResultMock = vi.fn().mockReturnValue(true);

        const settingsManager = <SettingsManager>{
            getValue: (k, d) => {
                const resolvers = {
                    [getExtensionSettingKey("WebSearch", "searchEngine")]: () => getWebSearchEngineMock(k, d),
                    [getExtensionSettingKey("WebSearch", "locale")]: () => getLocaleMock(k, d),
                    [getExtensionSettingKey("WebSearch", "showInstantSearchResult")]: () =>
                        getShowInstantSearchResultMock(k, d),
                };

                return resolvers[k] ? resolvers[k]() : undefined;
            },
        };

        const getExtensionAssetPathMock = vi.fn().mockReturnValue("myAssetFilePath");

        const assetPathResolver = <AssetPathResolver>{
            getExtensionAssetPath: (e, a) => getExtensionAssetPathMock(e, a),
        };

        const webSearchExtension = new WebSearchExtension(assetPathResolver, settingsManager, [webSearchEngine]);

        expect(webSearchExtension.getInstantSearchResultItems("my search term")).toEqual({
            after: [
                <SearchResultItem>{
                    defaultAction: createOpenUrlSearchResultAction({ url: "mySearchUrl" }),
                    description: "searchEngine1",
                    id: "search-searchEngine1",
                    image: { url: "file://myAssetFilePath" },
                    name: `Search "my search term"`,
                },
            ],
            before: [],
        });

        expect(getWebSearchEngineMock).toHaveBeenCalledWith(
            getExtensionSettingKey("WebSearch", "searchEngine"),
            "Google",
        );

        expect(getLocaleMock).toHaveBeenCalledWith(getExtensionSettingKey("WebSearch", "locale"), "en-US");
        expect(getSearchUrlMock).toHaveBeenCalledWith("my search term", "de-CH");
        expect(getExtensionAssetPathMock).toHaveBeenCalledWith("WebSearch", "imageFileName");
        expect(getShowInstantSearchResultMock).toHaveBeenCalledWith(
            getExtensionSettingKey("WebSearch", "showInstantSearchResult"),
            false,
        );
    });

    it("should return the correct default values", () => {
        const webSearchExtension = new WebSearchExtension(<AssetPathResolver>{}, <SettingsManager>{}, []);
        expect(webSearchExtension.getSettingDefaultValue("searchEngine")).toBe("Google");
        expect(webSearchExtension.getSettingDefaultValue("locale")).toBe("en-US");
    });

    it("should return the correct image url", () => {
        const getExtensionAssetPathMock = vi.fn().mockReturnValue("assets/asset.png");

        const assetPathResolver = <AssetPathResolver>{
            getExtensionAssetPath: (e, a) => getExtensionAssetPathMock(e, a),
        };

        const settingsManager = <SettingsManager>{};

        const webSearchExtension = new WebSearchExtension(assetPathResolver, settingsManager, []);

        expect(webSearchExtension.getImage()).toEqual(<Image>{ url: "file://assets/asset.png" });
        expect(getExtensionAssetPathMock).toHaveBeenCalledWith("WebSearch", "websearch.png");
    });

    it("should return the correct asset file path", () => {
        const getExtensionAssetPathMock = vi.fn().mockReturnValue("assets/asset.png");

        const assetPathResolver = <AssetPathResolver>{
            getExtensionAssetPath: (e, a) => getExtensionAssetPathMock(e, a),
        };

        const googleWebSearchEngine = <WebSearchEngine>{
            getName: () => "Google",
            getImageFileName: () => "google.png",
        };

        const webSearchExtension = new WebSearchExtension(assetPathResolver, <SettingsManager>{}, [
            googleWebSearchEngine,
        ]);

        expect(webSearchExtension.getAssetFilePath("Google")).toBe("assets/asset.png");
        expect(getExtensionAssetPathMock).toHaveBeenCalledWith("WebSearch", "google.png");

        expect(() => {
            webSearchExtension.getAssetFilePath("Blub");
        }).toThrowError("Unable to find web search engine with name 'Blub'");
    });

    it("should return all setting keys that trigger a rescan", () => {
        expect(
            new WebSearchExtension(<AssetPathResolver>{}, <SettingsManager>{}, []).getSettingKeysTriggeringRescan(),
        ).toEqual(["general.language", getExtensionSettingKey("WebSearch", "searchEngine")]);
    });

    it("should be supported on all systems", () => {
        expect(new WebSearchExtension(<AssetPathResolver>{}, <SettingsManager>{}, []).isSupported()).toBe(true);
    });

    it("should get search result items", async () => {
        const getValueMock = vi.fn().mockReturnValue("MyEngine");
        const getExtensionAssetPathMock = vi.fn().mockReturnValue("assets/asset.png");

        const settingsManager = <SettingsManager>{ getValue: (key, defaultValue) => getValueMock(key, defaultValue) };

        const assetPathResolver = <AssetPathResolver>{
            getExtensionAssetPath: (e, a) => getExtensionAssetPathMock(e, a),
        };

        const webSearchEngine = <WebSearchEngine>{
            getName: () => "MyEngine",
            getImageFileName: () => "myEngine.png",
        };

        const webSearchExtension = new WebSearchExtension(assetPathResolver, settingsManager, [webSearchEngine]);

        expect(await webSearchExtension.getSearchResultItems()).toEqual([
            <SearchResultItem>{
                defaultAction: createInvokeExtensionAction({
                    description: "Search MyEngine",
                    extensionId: "WebSearch",
                }),
                description: "Web Search",
                id: "webSearch:invoke",
                name: "MyEngine",
                image: { url: "file://assets/asset.png" },
            },
        ]);

        expect(getValueMock).toHaveBeenCalledWith(getExtensionSettingKey("WebSearch", "searchEngine"), "Google");
    });

    it("should return the suggestions on invocation", async () => {
        const getSearchEngineMock = vi.fn().mockReturnValue("MyEngine");
        const getLocaleMock = vi.fn().mockReturnValue("de-CH");
        const getExtensionAssetPathMock = vi.fn().mockReturnValue("assets/asset.png");

        const settingsManager = <SettingsManager>{
            getValue: (key, defaultValue) =>
                key === getExtensionSettingKey("WebSearch", "searchEngine")
                    ? getSearchEngineMock(key, defaultValue)
                    : getLocaleMock(key, defaultValue),
        };

        const assetPathResolver = <AssetPathResolver>{
            getExtensionAssetPath: (e, a) => getExtensionAssetPathMock(e, a),
        };

        const webSearchEngine = <WebSearchEngine>{
            getName: () => "MyEngine",
            getImageFileName: () => "myEngine.png",
            getSearchUrl: (searchTerm, locale) => `search-url-${searchTerm}-${locale}`,
            getSuggestions: (searchTerm, locale) =>
                Promise.resolve(<Suggestion[]>[{ text: `suggestion-${searchTerm}-${locale}`, url: "suggestion-url" }]),
        };

        const webSearchExtension = new WebSearchExtension(assetPathResolver, settingsManager, [webSearchEngine]);

        expect(await webSearchExtension.invoke({ searchTerm: "mySearchTerm" })).toEqual(<SearchResultItem[]>[
            {
                defaultAction: createOpenUrlSearchResultAction({
                    url: "search-url-mySearchTerm-de-CH",
                }),
                description: "MyEngine",
                id: `search-MyEngine`,
                name: `Search "mySearchTerm"`,
                image: { url: "file://assets/asset.png" },
            },
            {
                defaultAction: createOpenUrlSearchResultAction({ url: "suggestion-url" }),
                description: "Suggestion",
                id: "suggestion-0",
                name: "suggestion-mySearchTerm-de-CH",
                image: { url: "file://assets/asset.png" },
            },
        ]);
    });

    it("should support en-US and de-CH locales", () => {
        expect(
            Object.keys(new WebSearchExtension(<AssetPathResolver>{}, <SettingsManager>{}, []).getI18nResources()),
        ).toEqual(["en-US", "de-CH"]);
    });
});
