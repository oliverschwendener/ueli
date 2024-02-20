import type { AssetPathResolver } from "@Core/AssetPathResolver";
import { describe, expect, it, vi } from "vitest";
import { Application } from "./Application";
import type { ApplicationRepository } from "./ApplicationRepository";
import { ApplicationSearch } from "./ApplicationSearch";
import type { Settings } from "./Settings";

describe(ApplicationSearch, () => {
    it("should get all applications and convert them to search result items", async () => {
        const application1 = new Application("app1", "filepath1", { url: "iconFilePath1" });
        const application2 = new Application("app2", "filepath1", { url: "iconFilePath1" });
        const application3 = new Application("app3", "filepath1", { url: "iconFilePath1" });
        const applications = [application1, application2, application3];

        const getApplicationsMock = vi.fn().mockResolvedValue(applications);

        const applicationRepository = <ApplicationRepository>{
            getApplications: () => getApplicationsMock(),
        };

        const searchResultItems = await new ApplicationSearch(
            "Windows",
            applicationRepository,
            <Settings>{},
            <AssetPathResolver>{},
        ).getSearchResultItems();

        expect(searchResultItems).toEqual(applications.map((application) => application.toSearchResultItem()));
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
