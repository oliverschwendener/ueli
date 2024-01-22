import type { ExcludedSearchResultItem, SearchResultItem } from "@common/Core";
import { describe, expect, it } from "vitest";
import { Application } from "./Application";

describe(Application, () => {
    it("should correctly serialize to SearchResultItem", () => {
        const application = new Application("My App", "/Applications/My App.app", "/Users/Dummy/Icons/icon.png");

        expect(application.toSearchResultItem()).toEqual(<SearchResultItem>{
            description: "Application",
            descriptionTranslationKey: "extension[ApplicationSearch].searchResultItemDescription",
            id: "W0FwcGxpY2F0aW9uU2VhcmNoXVsvQXBwbGljYXRpb25zL015IEFwcC5hcHBd",
            name: "My App",
            imageUrl: "file:///Users/Dummy/Icons/icon.png",
            additionalActions: [
                {
                    argument: "/Applications/My App.app",
                    description: "Show in file explorer",
                    descriptionTranslationKey:
                        "extension[ApplicationSearch].searchResultItem.additionalAction.showInFileExplorer",
                    handlerId: "ShowItemInFileExplorer",
                    hideWindowAfterInvocation: true,
                    fluentIcon: "DocumentFolderRegular",
                },
                {
                    argument: "/Applications/My App.app",
                    description: "Copy file path to clipboard",
                    descriptionTranslationKey:
                        "extension[ApplicationSearch].searchResultItem.additionalAction.copyFilePathToClipboard",
                    handlerId: "copyToClipboard",
                    hideWindowAfterInvocation: false,
                    fluentIcon: "ClipboardRegular",
                },
                {
                    argument: JSON.stringify(<ExcludedSearchResultItem>{
                        id: "W0FwcGxpY2F0aW9uU2VhcmNoXVsvQXBwbGljYXRpb25zL015IEFwcC5hcHBd",
                        name: "My App",
                        imageUrl: "file:///Users/Dummy/Icons/icon.png",
                    }),
                    description: "Exclude from search results",
                    descriptionTranslationKey: "searchResultItem.action.excludeFromSearchResults",
                    fluentIcon: "EyeOffRegular",
                    handlerId: "excludeFromSearchResults",
                    hideWindowAfterInvocation: false,
                },
            ],
            defaultAction: {
                argument: "/Applications/My App.app",
                description: "Open application",
                descriptionTranslationKey:
                    "extension[ApplicationSearch].searchResultItem.defaultAction.openApplication",
                handlerId: "OpenFilePath",
                hideWindowAfterInvocation: true,
                fluentIcon: "OpenRegular",
            },
        });
    });
});
