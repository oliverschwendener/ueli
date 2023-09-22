import type { SearchResultItem } from "@common/SearchResultItem";
import { describe, expect, it } from "vitest";
import { Application } from "./Application";

describe(Application, () => {
    it("should correctly serialize to SearchResultItem", () => {
        const application = new Application("My App", "/Applications/My App.app", "/Users/Dummy/Icons/icon.png");

        expect(application.toSearchResultItem()).toEqual(<SearchResultItem>{
            description: "Application",
            descriptionTranslationKey: "plugin[ApplicationSearch].searchResultItemDescription",
            executionServiceArgument: "/Applications/My App.app",
            executionServiceId: "FilePath",
            id: "L0FwcGxpY2F0aW9ucy9NeSBBcHAuYXBw",
            name: "My App",
            imageUrl: "file:///Users/Dummy/Icons/icon.png",
            hideWindowAfterExecution: true,
        });
    });
});
