import { type OperatingSystem } from "@common/Core";
import { type Image } from "@common/Core/Image";
import { type AssetPathResolver } from "@Core/AssetPathResolver";
import type { FirefoxBookmarkRepository } from "@Core/WebBrowser/Utility";
import type { WebBrowser, WebBrowserBookmark } from "../../Contract";

export class Zen implements WebBrowser {
    private readonly name = "Zen";

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
            url: `file://${this.assetPathResolver.getModuleAssetPath("WebBrowser", "zen.png")}`,
        };
    }

    public async getBookmarks(): Promise<WebBrowserBookmark[]> {
        return this.firefoxBookmarkRepository.getAll(this.name);
    }

    public isSupported(): boolean {
        return this.operatingSystem === "macOS" || this.operatingSystem === "Windows";
    }
}
