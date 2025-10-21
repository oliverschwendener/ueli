import type { OperatingSystem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { WebBrowser, WebBrowserBookmark } from "@Core/WebBrowser/Contract";
import type { App } from "electron";
import { join } from "path";
import type { ChromiumBrowserBookmarkRepository } from "../../Utility";

export class GoogleChrome implements WebBrowser {
    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly app: App,
        private readonly bookmarkRepository: ChromiumBrowserBookmarkRepository,
        private readonly assetPathResolver: AssetPathResolver,
    ) {}

    public getName(): string {
        return "Google Chrome";
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getModuleAssetPath("WebBrowser", "google-chrome.png")}`,
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
                    "Google",
                    "Chrome",
                    "User Data",
                    "Default",
                    "Bookmarks",
                ),
            macOS: () => join(this.app.getPath("appData"), "Google", "Chrome", "Default", "Bookmarks"),
            Linux: () => {
                throw new Error("Linux is not supported by Google Chrome.");
            },
        };

        return map[this.operatingSystem]();
    }
}
