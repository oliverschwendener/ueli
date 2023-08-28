import { describe, it, expect } from "vitest";
import { Application } from "./Application";
import { SearchResultItem } from "@common/SearchResultItem";

describe(Application, () => {
    it("should map to a SearchResultItem", () => {
        expect(
            Application.fromFilePathAndIcon({
                filePath: "/Applications/Utilities/Adobe Creative Cloud/Utils/Creative Cloud Uninstaller.app",
                iconFilePath: "/Users/UserName/Application Support/ueli/PluginCache/image.png",
            }).toSearchResultItem(),
        ).toEqual(<SearchResultItem>{
            id: "L0FwcGxpY2F0aW9ucy9VdGlsaXRpZXMvQWRvYmUgQ3JlYXRpdmUgQ2xvdWQvVXRpbHMvQ3JlYXRpdmUgQ2xvdWQgVW5pbnN0YWxsZXIuYXBw",
            description: "Application",
            name: "Creative Cloud Uninstaller",
            imageUrl: "file:///Users/UserName/Application Support/ueli/PluginCache/image.png",
        });
    });
});
