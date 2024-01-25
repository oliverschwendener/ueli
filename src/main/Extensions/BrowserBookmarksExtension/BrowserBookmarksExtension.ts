import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
import type { SearchResultItem } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Browser } from "@common/Extensions/BrowserBookmarks";
import type { BrowserBookmarkRepository } from "./BrowserBookmarkRepository";

export class BrowserBookmarksExtension implements Extension {
    public readonly id = "BrowserBookmarks";
    public readonly name = "Browser Bookmarks";
    public readonly nameTranslationKey = "extension[BrowserBookmarks].extensionName";

    public constructor(
        private readonly browserBookmarkRepository: BrowserBookmarkRepository,
        private readonly settingsManager: SettingsManager,
        private readonly assetPathResolver: AssetPathResolver,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const browser = this.settingsManager.getValue<Browser>(
            getExtensionSettingKey("BrowserBookmarks", "browser"),
            this.getSettingDefaultValue("browser"),
        );

        const searchResultStyle = this.settingsManager.getValue<string>(
            getExtensionSettingKey(this.id, "searchResultStyle"),
            this.getSettingDefaultValue("searchResultStyle"),
        );

        return (await this.browserBookmarkRepository.getAll(browser)).map((browserBookmark) =>
            browserBookmark.toSearchResultItem(searchResultStyle),
        );
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue<T>(key: string): T {
        const settings: Record<string, unknown> = {
            browser: "Google Chrome",
            searchResultStyle: "nameOnly",
            "image[Arc]": this.getBrowserImageUrl("Arc"),
            "image[BraveBrowser]": this.getBrowserImageUrl("Brave Browser"),
            "image[GoogleChrome]": this.getBrowserImageUrl("Google Chrome"),
            "image[MicrosoftEdge]": this.getBrowserImageUrl("Microsoft Edge"),
        };

        return settings[key] as T;
    }

    public getSettingKeysTriggeringReindex(): string[] {
        return ["extension[BrowserBookmarks].browser", "extension[BrowserBookmarks].searchResultStyle"];
    }

    private getBrowserImageUrl(browser: Browser): string {
        const map: Record<Browser, string> = {
            Arc: "arc.png",
            "Brave Browser": "brave-browser.png",
            "Google Chrome": "google-chrome.png",
            "Microsoft Edge": "microsoft-edge.png",
        };

        return `file://${this.assetPathResolver.getExtensionAssetPath(this.id, map[browser])}`;
    }
}
