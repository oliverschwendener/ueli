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
        };

        return settings[key] as T;
    }

    public getSettingKeysTriggeringReindex(): string[] {
        return ["extension[BrowserBookmarks].browser", "extension[BrowserBookmarks].searchResultStyle"];
    }

    public getAssetFilePath(key: string): string {
        const assetFileNames: Record<string, string> = {
            "browser:Arc": "arc.png",
            "browser:Brave Browser": "brave-browser.png",
            "browser:Google Chrome": "google-chrome.png",
            "browser:Microsoft Edge": "microsoft-edge.png",
            "browser:Yandex Browser": "yandex-browser.svg",
        };

        const assetFileName = assetFileNames[key];

        return this.assetPathResolver.getExtensionAssetPath(this.id, assetFileName);
    }
}
