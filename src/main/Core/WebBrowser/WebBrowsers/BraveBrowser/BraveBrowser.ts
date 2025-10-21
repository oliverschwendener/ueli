import type { OperatingSystem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { App } from "electron";
import { join } from "path";
import type { WebBrowser, WebBrowserBookmark } from "../../Contract";
import type { ChromiumBrowserBookmarkRepository } from "../../Utility";

export class BraveBrowser implements WebBrowser {
    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly app: App,
        private readonly bookmarkRepository: ChromiumBrowserBookmarkRepository,
        private readonly assetPathResolver: AssetPathResolver,
    ) {}

    public getName(): string {
        return "Brave Browser";
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getModuleAssetPath("WebBrowser", "brave-browser.png")}`,
        };
    }

    public isSupported(): boolean {
        return this.operatingSystem === "Windows" || this.operatingSystem === "macOS";
    }

    public async getBookmarks(): Promise<WebBrowserBookmark[]> {
        return await this.bookmarkRepository.getAll(this.getBookmarkFilePath());
    }

    private getBookmarkFilePath(): string {
        const map: Record<OperatingSystem, () => string> = {
            Windows: () =>
                join(
                    this.app.getPath("home"),
                    "AppData",
                    "Local",
                    "BraveSoftware",
                    "Brave-Browser",
                    "User Data",
                    "Default",
                    "Bookmarks",
                ),
            macOS: () => join(this.app.getPath("appData"), "BraveSoftware", "Brave-Browser", "Default", "Bookmarks"),
            Linux: () => {
                throw new Error("Linux is not supported by Brave Browser.");
            },
        };

        return map[this.operatingSystem]();
    }
}
