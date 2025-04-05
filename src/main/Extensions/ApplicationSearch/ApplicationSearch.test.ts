import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { OperatingSystem, SearchResultItem } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import { describe, expect, it, vi } from "vitest";
import type { Application } from "./Application";
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

    describe("isSupported", () => {
        const testIsSupported = ({
            expected,
            operatingSystem,
        }: {
            expected: boolean;
            operatingSystem: OperatingSystem;
        }) => {
            expect(
                new ApplicationSearch(
                    operatingSystem,
                    <ApplicationRepository>{},
                    <Settings>{},
                    <AssetPathResolver>{},
                ).isSupported(),
            ).toBe(expected);
        };

        it("should return true on Windows", () => testIsSupported({ expected: true, operatingSystem: "Windows" }));
        it("should return true on macOS", () => testIsSupported({ expected: true, operatingSystem: "macOS" }));
        it("should return true on Linux", () => testIsSupported({ expected: true, operatingSystem: "Linux" }));
    });

    it("should support en-US, de-DE and ja-JP translations", () => {
        const translations = new ApplicationSearch(
            "Windows",
            <ApplicationRepository>{},
            <Settings>{},
            <AssetPathResolver>{},
        ).getI18nResources();

        expect(Object.keys(translations)).to.include("en-US");
        expect(Object.keys(translations)).to.include("de-CH");
        expect(Object.keys(translations)).to.include("ja-JP");
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

        expect(
            new ApplicationSearch("Linux", <ApplicationRepository>{}, <Settings>{}, assetPathResolver).getImage(),
        ).toEqual({ url: "file://someFilePath" });

        expect(getExtensionAssetPathMock).toHaveBeenCalledWith("ApplicationSearch", "windows-generic-app-icon.png");
        expect(getExtensionAssetPathMock).toHaveBeenCalledWith("ApplicationSearch", "macos-applications.png");
        expect(getExtensionAssetPathMock).toHaveBeenCalledWith("ApplicationSearch", "linux-applications.png");
        expect(getExtensionAssetPathMock).toHaveBeenCalledTimes(3);
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
            getExtensionSettingKey("ApplicationSearch", "mdfindFilterOption"),
        ]);
    });
});
