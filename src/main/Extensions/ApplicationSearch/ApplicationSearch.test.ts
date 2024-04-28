import type { AssetPathResolver } from "@Core/AssetPathResolver";
import { SearchResultItem } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import { describe, expect, it, vi } from "vitest";
import { Application } from "./Application";
import type { ApplicationRepository } from "./ApplicationRepository";
import { ApplicationSearch } from "./ApplicationSearch";
import type { Settings } from "./Settings";

describe(ApplicationSearch, () => {
    it("should get all applications and convert them to search result items", async () => {
        const applications = [
            <Application>{
                getId: vi.fn().mockReturnValue("1"),
                toSearchResultItem: vi.fn().mockReturnValue(<SearchResultItem>{ id: "1" }),
            },
            <Application>{
                getId: vi.fn().mockReturnValue("2"),
                toSearchResultItem: vi.fn().mockReturnValue(<SearchResultItem>{ id: "2" }),
            },
            {
                getId: vi.fn().mockReturnValue("3"),
                toSearchResultItem: vi.fn().mockReturnValue(<SearchResultItem>{ id: "2" }),
            },
        ];

        const applicationRepository = <ApplicationRepository>{
            getApplications: vi.fn().mockResolvedValue(applications),
        };

        const searchResultItems = await new ApplicationSearch(
            "Windows",
            applicationRepository,
            <Settings>{},
            <AssetPathResolver>{},
        ).getSearchResultItems();

        expect(searchResultItems).toEqual(applications.map((application) => application.toSearchResultItem()));
        expect(applicationRepository.getApplications).toHaveBeenCalledOnce();
    });

    it("should return a default value provided by the DefaultSettingValueProvider", () => {
        const settings = <Settings>{
            getDefaultValue: (key) => {
                return {
                    key1: "value1",
                    key2: "value2",
                }[key];
            },
        };

        const applicationSearch = new ApplicationSearch(
            "Windows",
            <ApplicationRepository>{},
            settings,
            <AssetPathResolver>{},
        );

        expect(applicationSearch.getSettingDefaultValue("key1")).toBe("value1");
        expect(applicationSearch.getSettingDefaultValue("key2")).toBe("value2");
        expect(applicationSearch.getSettingDefaultValue("key3")).toBe(undefined);
    });

    it("should support Windows, macOS and Linux", () => {
        expect(
            new ApplicationSearch(
                "Windows",
                <ApplicationRepository>{},
                <Settings>{},
                <AssetPathResolver>{},
            ).isSupported(),
        ).toBe(true);

        expect(
            new ApplicationSearch(
                "macOS",
                <ApplicationRepository>{},
                <Settings>{},
                <AssetPathResolver>{},
            ).isSupported(),
        ).toBe(true);

        expect(
            new ApplicationSearch(
                "Linux",
                <ApplicationRepository>{},
                <Settings>{},
                <AssetPathResolver>{},
            ).isSupported(),
        ).toBe(true);
    });

    it("should support en-US and de-DE translations", () => {
        const translations = new ApplicationSearch(
            "Windows",
            <ApplicationRepository>{},
            <Settings>{},
            <AssetPathResolver>{},
        ).getTranslations();

        expect(Object.keys(translations)).to.include("en-US");
        expect(Object.keys(translations)).to.include("de-CH");
    });

    it("should return the correct image for the given operating system", () => {
        const getExtensionAssetPathMock = vi.fn().mockReturnValue("someFilePath");

        const assetPathResolver = <AssetPathResolver>{
            getExtensionAssetPath: (e, a) => getExtensionAssetPathMock(e, a),
        };

        expect(
            new ApplicationSearch("Windows", <ApplicationRepository>{}, <Settings>{}, assetPathResolver).getImage(),
        ).toEqual({ url: "file://someFilePath" });

        expect(
            new ApplicationSearch("macOS", <ApplicationRepository>{}, <Settings>{}, assetPathResolver).getImage(),
        ).toEqual({ url: "file://someFilePath" });

        expect(getExtensionAssetPathMock).toHaveBeenCalledWith("ApplicationSearch", "windows-generic-app-icon.png");
        expect(getExtensionAssetPathMock).toHaveBeenCalledWith("ApplicationSearch", "macos-applications.png");
        expect(getExtensionAssetPathMock).toHaveBeenCalledTimes(2);
    });

    it("should get the correct setting ids that trigger a rescan", () => {
        const settingKeys = new ApplicationSearch(
            "Windows",
            <ApplicationRepository>{},
            <Settings>{},
            <AssetPathResolver>{},
        ).getSettingKeysTriggeringRescan();

        expect(settingKeys).toEqual([
            getExtensionSettingKey("ApplicationSearch", "windowsFolders"),
            getExtensionSettingKey("ApplicationSearch", "windowsFileExtensions"),
            getExtensionSettingKey("ApplicationSearch", "includeWindowsStoreApps"),
            getExtensionSettingKey("ApplicationSearch", "macOsFolders"),
        ]);
    });
});
