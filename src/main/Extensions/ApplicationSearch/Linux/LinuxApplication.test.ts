import type { Image } from "@common/Core/Image";
import { describe, expect, it } from "vitest";
import { LinuxApplication } from "./LinuxApplication";

describe(LinuxApplication, () => {
    describe(LinuxApplication.prototype.toSearchResultItem, () => {
        it("should have the OpenDesktopFile action as default", () => {
            const application = new LinuxApplication("MyApp", "/Path/To/MyApp.desktop", <Image>{});
            const defaultAction = application.toSearchResultItem().defaultAction;
            expect(defaultAction.handlerId).toBe("LaunchDesktopFile");
        });

        it("should have ShowItemInFileExplorer and CopyToClipboard as additional actions", () => {
            const application = new LinuxApplication("MyApp", "/Path/To/MyApp.desktop", <Image>{});
            const additionalActions = application.toSearchResultItem().additionalActions;
            expect(additionalActions?.map((a) => a.handlerId)).toEqual(["ShowItemInFileExplorer", "copyToClipboard"]);
        });
    });

    describe(LinuxApplication.prototype.getId, () => {
        it("should return a base64 encoded string containing the file path", () => {
            const application = new LinuxApplication("MyApp", "/Path/To/MyApp.desktop", <Image>{});
            const base64DecodedId = Buffer.from(application.getId(), "base64").toString();
            expect(base64DecodedId).toBe("[LinuxApplication][/Path/To/MyApp.desktop]");
        });
    });
});
