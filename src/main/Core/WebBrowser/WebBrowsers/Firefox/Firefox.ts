import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { OperatingSystem } from "@Shared/Core";
import type { Image } from "@Shared/Core/Image";

import type { WebBrowser, WebBrowserBookmark } from "../../Contract";
import type { FirefoxBookmarkRepository } from "../../Utility";

export class Firefox implements WebBrowser {
    private readonly name = "Firefox";

    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly firefoxBookmarkRepository: FirefoxBookmarkRepository,
        private readonly assetPathResolver: AssetPathResolver,
    ) {}

    public getName(): string {
        return this.name;
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getModuleAssetPath("WebBrowser", "firefox.png")}`,
        };
    }

    public async getBookmarks(): Promise<WebBrowserBookmark[]> {
        return this.firefoxBookmarkRepository.getAll(this.name);
    }

    public isSupported(): boolean {
        return this.operatingSystem === "Windows" || this.operatingSystem === "macOS";
    }
}
