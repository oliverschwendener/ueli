import { SearchResultItemActionUtility, type SearchResultItem } from "@common/Core";
import { describe, expect, it } from "vitest";
import { Application } from "./Application";

describe(Application, () => {
    it("should correctly serialize to SearchResultItem", () => {
        const application = new Application("My App", "/Applications/My App.app", "/Users/Dummy/Icons/icon.png");

        expect(application.toSearchResultItem()).toEqual(<SearchResultItem>{
            description: "Application",
            descriptionTranslation: {
                key: "searchResultItemDescription",
                namespace: "extension[ApplicationSearch]",
            },
            id: "W0FwcGxpY2F0aW9uU2VhcmNoXVsvQXBwbGljYXRpb25zL015IEFwcC5hcHBd",
            name: "My App",
            imageUrl: "file:///Users/Dummy/Icons/icon.png",
            defaultAction: SearchResultItemActionUtility.createOpenFileAction({
                filePath: "/Applications/My App.app",
                description: "Open application",
                descriptionTranslation: {
                    key: "openApplication",
                    namespace: "extension[ApplicationSearch]",
                },
            }),
            additionalActions: [
                SearchResultItemActionUtility.createShowItemInFileExplorerAction({
                    filePath: "/Applications/My App.app",
                }),
                SearchResultItemActionUtility.createCopyToClipboardAction({
                    textToCopy: "/Applications/My App.app",
                    description: "Copy file path to clipboard",
                    descriptionTranslation: {
                        key: "copyFilePathToClipboard",
                        namespace: "extension[ApplicationSearch]",
                    },
                }),
                SearchResultItemActionUtility.createExcludeFromSearchResultsAction({
                    id: "W0FwcGxpY2F0aW9uU2VhcmNoXVsvQXBwbGljYXRpb25zL015IEFwcC5hcHBd",
                    name: "My App",
                    imageUrl: "file:///Users/Dummy/Icons/icon.png",
                }),
            ],
        });
    });
});
