import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { OperatingSystem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { App } from "electron";
import { join } from "path";
import type { WebBrowser, WebBrowserBookmark } from "../../Contract";
import type { ChromiumBrowserBookmarkRepository } from "../../Utility";

export class MicrosoftEdge implements WebBrowser {
    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly app: App,
        private readonly bookmarkRepository: ChromiumBrowserBookmarkRepository,
        private readonly assetPathResolver: AssetPathResolver,
    ) {}

    public getName(): string {
        return "Microsoft Edge";
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getModuleAssetPath("WebBrowser", "microsoft-edge.png")}`,
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
                    "Microsoft",
                    "Edge",
                    "User Data",
                    "Default",
                    "Bookmarks",
                ),
            macOS: () => join(this.app.getPath("appData"), "Microsoft Edge", "Default", "Bookmarks"),
            Linux: () => {
                throw new Error("Linux is not supported by Microsoft Edge.");
            },
        };

        return map[this.operatingSystem]();
    }
}
