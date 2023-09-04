import type { SearchResultItem } from "@common/SearchResultItem";
import { describe, expect, it } from "vitest";
import { Application } from "./Application";

describe(Application, () => {
    it("should map to a SearchResultItem", () => {
        expect(
            Application.fromFilePathAndOptionalIcon({
                filePath: "/Applications/Utilities/Adobe Creative Cloud/Utils/Creative Cloud Uninstaller.app",
                iconFilePath: "/Users/UserName/Application Support/ueli/PluginCache/image.png",
            }).toSearchResultItem(),
        ).toEqual(<SearchResultItem>{
            id: "L0FwcGxpY2F0aW9ucy9VdGlsaXRpZXMvQWRvYmUgQ3JlYXRpdmUgQ2xvdWQvVXRpbHMvQ3JlYXRpdmUgQ2xvdWQgVW5pbnN0YWxsZXIuYXBw",
            description: "Application",
            name: "Creative Cloud Uninstaller",
            imageUrl: "file:///Users/UserName/Application Support/ueli/PluginCache/image.png",
            executionServiceId: "FilePath",
            executionServiceArgument:
                "/Applications/Utilities/Adobe Creative Cloud/Utils/Creative Cloud Uninstaller.app",
        });
    });

    it("should map to a SearchResultItem without imageUrl if iconFilePath is undefined or null", () => {
        expect(
            Application.fromFilePathAndOptionalIcon({
                filePath: "/Applications/Utilities/Adobe Creative Cloud/Utils/Creative Cloud Uninstaller.app",
                iconFilePath: undefined,
            }).toSearchResultItem(),
        ).toEqual(<SearchResultItem>{
            id: "L0FwcGxpY2F0aW9ucy9VdGlsaXRpZXMvQWRvYmUgQ3JlYXRpdmUgQ2xvdWQvVXRpbHMvQ3JlYXRpdmUgQ2xvdWQgVW5pbnN0YWxsZXIuYXBw",
            description: "Application",
            name: "Creative Cloud Uninstaller",
            imageUrl: undefined,
            executionServiceId: "FilePath",
            executionServiceArgument:
                "/Applications/Utilities/Adobe Creative Cloud/Utils/Creative Cloud Uninstaller.app",
        });

        expect(
            Application.fromFilePathAndOptionalIcon({
                filePath: "/Applications/Utilities/Adobe Creative Cloud/Utils/Creative Cloud Uninstaller.app",
                iconFilePath: null,
            }).toSearchResultItem(),
        ).toEqual(<SearchResultItem>{
            id: "L0FwcGxpY2F0aW9ucy9VdGlsaXRpZXMvQWRvYmUgQ3JlYXRpdmUgQ2xvdWQvVXRpbHMvQ3JlYXRpdmUgQ2xvdWQgVW5pbnN0YWxsZXIuYXBw",
            description: "Application",
            name: "Creative Cloud Uninstaller",
            imageUrl: undefined,
            executionServiceId: "FilePath",
            executionServiceArgument:
                "/Applications/Utilities/Adobe Creative Cloud/Utils/Creative Cloud Uninstaller.app",
        });
    });
});
