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

    private readonly defaultSettings = {
        browser: "Google Chrome",
        searchResultStyle: "nameOnly",
        faviconApi: "Google",
    };

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

        const faviconApi = this.settingsManager.getValue<string>(
            getExtensionSettingKey(this.id, "faviconApi"),
            this.getSettingDefaultValue("faviconApi"),
        );

        return (await this.browserBookmarkRepository.getAll(browser)).map((browserBookmark) =>
            browserBookmark.toSearchResultItem(searchResultStyle, faviconApi),
        );
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue<T>(key: string): T {
        return this.defaultSettings[key] as T;
    }

    public getSettingKeysTriggeringReindex(): string[] {
        return [
            getExtensionSettingKey(this.id, "browser"),
            getExtensionSettingKey(this.id, "searchResultStyle"),
            getExtensionSettingKey(this.id, "faviconApi"),
        ];
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
