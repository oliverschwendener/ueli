import { describe, expect, it } from "vitest";
import { createGtkLaunchAction } from "./creatGtkLaunchAction";

describe(createGtkLaunchAction, () => {
    it("should create a 'launch application' action", () => {
        expect(
            createGtkLaunchAction({
                filePath: "/usr/bin/firefox",
                description: "Open application",
                descriptionTranslation: {
                    key: "openApplication",
                    namespace: "extension[ApplicationSearch]",
                },
            }),
        ).toEqual({
            argument: "/usr/bin/firefox",
            description: "Open application",
            descriptionTranslation: {
                key: "openApplication",
                namespace: "extension[ApplicationSearch]",
            },
            handlerId: "GtkLaunch",
            fluentIcon: "OpenRegular",
        });
    });
});
