import { SearchResultItemAction } from "@common/Core";
import { describe, expect, it } from "vitest";
import { createLaunchDesktopFileAction } from "./createLaunchDesktopFileAction";

describe(createLaunchDesktopFileAction, () => {
    it("should create a 'launch application' action", () => {
        expect(
            createLaunchDesktopFileAction({
                filePath: "/usr/share/application/firefox.desktop",
                description: "Open application",
                descriptionTranslation: {
                    key: "openApplication",
                    namespace: "extension[ApplicationSearch]",
                },
            }),
        ).toEqual(<SearchResultItemAction>{
            argument: "/usr/share/application/firefox.desktop",
            description: "Open application",
            descriptionTranslation: {
                key: "openApplication",
                namespace: "extension[ApplicationSearch]",
            },
            handlerId: "LaunchDesktopFile",
            fluentIcon: "OpenRegular",
            hideWindowAfterInvocation: true,
        });
    });
});
