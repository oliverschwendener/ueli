import type { Image } from "@common/Core/Image";
import { describe, expect, it } from "vitest";
import { WindowsApplication } from "./WindowsApplication";

describe(WindowsApplication, () => {
    describe(WindowsApplication.prototype.toSearchResultItem, () => {
        it("should have OpenFilePath as the default action", () => {
            const application = new WindowsApplication("name", "filePath", <Image>{});
            const defaultAction = application.toSearchResultItem().defaultAction;
            expect(defaultAction.handlerId).toBe("OpenFilePath");
        });

        it("should have OpenFilePathAsAdministrator as an additional action", () => {
            const application = new WindowsApplication("name", "filePath", <Image>{});
            const additionalActions = application.toSearchResultItem().additionalActions;
            expect(additionalActions?.map((a) => a.handlerId)).toEqual([
                "WindowsOpenAsAdministrator",
                "ShowItemInFileExplorer",
                "copyToClipboard",
            ]);
        });
    });

    describe(WindowsApplication.prototype.getId, () => {
        it("should return a base64 encoded string containing the file path", () => {
            const application = new WindowsApplication("name", "filePath", <Image>{});
            const base64DecodedId = Buffer.from(application.getId(), "base64").toString();
            expect(base64DecodedId).toBe("[WindowsApplication][filePath]");
        });
    });
});
