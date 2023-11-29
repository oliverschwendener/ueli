import { describe, expect, it, vi } from "vitest";
import { Application } from "./Application";
import { ApplicationRepository } from "./ApplicationRepository";
import { ApplicationSearch } from "./ApplicationSearch";

describe(ApplicationSearch, () => {
    it("should get all applications and convert them to search result items", async () => {
        const application1 = new Application("app1", "filepath1", "iconFilePath1");
        const application2 = new Application("app2", "filepath1", "iconFilePath1");
        const application3 = new Application("app3", "filepath1", "iconFilePath1");
        const applications = [application1, application2, application3];

        const getApplicationsMock = vi.fn().mockResolvedValue(applications);

        const applicationRepository = <ApplicationRepository>{
            getApplications: () => getApplicationsMock(),
        };

        const searchResultItems = await new ApplicationSearch(applicationRepository).getSearchResultItems();

        expect(searchResultItems).toEqual(applications.map((application) => application.toSearchResultItem()));
    });
});
