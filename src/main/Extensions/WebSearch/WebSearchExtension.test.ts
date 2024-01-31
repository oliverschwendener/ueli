import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { SettingsManager } from "@Core/SettingsManager";
import { SearchResultItemActionUtility, type SearchResultItem } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import { describe, expect, it, vi } from "vitest";
import { Suggestion } from "./Suggestion";
import type { WebSearchEngine } from "./WebSearchEngine";
import { WebSearchExtension } from "./WebSearchExtension";

describe(WebSearchExtension, () => {
    it("should return the correct default values", () => {
        const webSearchExtension = new WebSearchExtension(<AssetPathResolver>{}, <SettingsManager>{}, []);
        expect(webSearchExtension.getSettingDefaultValue("searchEngine")).toBe("Google");
        expect(webSearchExtension.getSettingDefaultValue("locale")).toBe("en-US");
    });

    it("should return the correct image url", () => {
        const getExtensionAssetPathMock = vi.fn().mockReturnValue("assets/asset.png");
        const getValueMock = vi.fn().mockReturnValue("Google");

        const assetPathResolver = <AssetPathResolver>{
            getExtensionAssetPath: (e, a) => getExtensionAssetPathMock(e, a),
        };

        const settingsManager = <SettingsManager>{ getValue: (key, defaultValue) => getValueMock(key, defaultValue) };

        const googleWebSearchEngine = <WebSearchEngine>{
            getName: () => "Google",
            getImageFileName: () => "google.png",
        };

        const webSearchExtension = new WebSearchExtension(assetPathResolver, settingsManager, [googleWebSearchEngine]);

        expect(webSearchExtension.getImageUrl()).toBe("file://assets/asset.png");
        expect(getExtensionAssetPathMock).toHaveBeenCalledWith("WebSearch", "google.png");
        expect(getValueMock).toHaveBeenCalledWith(getExtensionSettingKey("WebSearch", "searchEngine"), "Google");
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
                defaultAction: SearchResultItemActionUtility.createInvokeExtensionAction({
                    description: "Search MyEngine",
                    extensionId: "WebSearch",
                }),
                description: "Web Search",
                id: "webSearch:invoke",
                name: "MyEngine",
                imageUrl: "file://assets/asset.png",
            },
        ]);

        expect(getValueMock).toHaveBeenCalledWith(getExtensionSettingKey("WebSearch", "searchEngine"), "Google");
    });

    it("should return the suggestions on invokation", async () => {
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
                defaultAction: SearchResultItemActionUtility.createOpenUrlSearchResultAction({
                    url: "search-url-mySearchTerm-de-CH",
                }),
                description: "MyEngine",
                id: `search-MyEngine`,
                name: `Search "mySearchTerm"`,
                imageUrl: "file://assets/asset.png",
            },
            {
                defaultAction: SearchResultItemActionUtility.createOpenUrlSearchResultAction({ url: "suggestion-url" }),
                description: "Suggestion",
                id: "suggestion-0",
                name: "suggestion-mySearchTerm-de-CH",
                imageUrl: "file://assets/asset.png",
            },
        ]);
    });
});
