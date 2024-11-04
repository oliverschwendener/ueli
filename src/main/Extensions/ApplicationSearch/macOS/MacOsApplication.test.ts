import type { Image } from "@common/Core/Image";
import { describe, expect, it } from "vitest";
import { MacOsApplication } from "./MacOsApplication";

describe(MacOsApplication, () => {
    describe(MacOsApplication.prototype.toSearchResultItem, () => {
        it("should have the OpenFilePath action as default", () => {
            const application = new MacOsApplication("MyApp", "/Path/To/MyApp.app", <Image>{});
            const defaultAction = application.toSearchResultItem().defaultAction;
            expect(defaultAction.handlerId).toBe("OpenFilePath");
        });

        it("should OpenFileLocation and CopyToclipboard as additional actions", () => {
            const application = new MacOsApplication("MyApp", "/Path/To/MyApp.app", <Image>{});
            const additionalActions = application.toSearchResultItem().additionalActions;
            expect(additionalActions?.map((a) => a.handlerId)).toEqual(["ShowItemInFileExplorer", "copyToClipboard"]);
        });
    });

    describe(MacOsApplication.prototype.getId, () => {
        it("should be a base64 encoded string including the file path", () => {
            const application = new MacOsApplication("MyApp", "/Path/To/MyApp.app", <Image>{});
            const base64DecodedId = Buffer.from(application.getId(), "base64").toString();
            expect(base64DecodedId).toBe("[MacOsApplication][/Path/To/MyApp.app]");
        });
    });
});
