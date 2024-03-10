import type { AssetPathResolver } from "@Core/AssetPathResolver";
import { SearchResultItem } from "@common/Core";
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
});
