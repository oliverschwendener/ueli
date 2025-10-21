import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { OperatingSystem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { App } from "electron";
import { join } from "path";
import type { WebBrowser, WebBrowserBookmark } from "../../Contract";
import type { ChromiumBrowserBookmarkRepository } from "../../Utility";

export class YandexBrowser implements WebBrowser {
    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly app: App,
        private readonly bookmarkRepository: ChromiumBrowserBookmarkRepository,
        private readonly assetPathResolver: AssetPathResolver,
    ) {}

    public getName(): string {
        return "Yandex Browser";
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getModuleAssetPath("WebBrowser", "yandex-browser.svg")}`,
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
                    "Yandex",
                    "YandexBrowser",
                    "User Data",
                    "Default",
                    "Bookmarks",
                ),
            macOS: () => join(this.app.getPath("appData"), "Yandex", "YandexBrowser", "Default", "Bookmarks"),
            Linux: () => {
                throw new Error("Linux is not supported by Yandex Browser.");
            },
        };

        return map[this.operatingSystem]();
    }
}
