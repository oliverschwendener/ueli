import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
import type { SearchResultItem } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Browser } from "@common/Extensions/BrowserBookmarks";
import type { BrowserBookmarkRepository } from "./BrowserBookmarkRepository";

export class BrowserBookmarks implements Extension {
    public readonly id = "BrowserBookmarks";
    public readonly name = "Browser Bookmarks";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: "extension[BrowserBookmarks]",
    };

    public readonly author = {
        name: "Oliver Schwendener",
        githubUserName: "oliverschwendener",
    };

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
        const browser = this.getCurrentlyConfiguredBrowser();

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

    public getSettingKeysTriggeringRescan(): string[] {
        return [
            getExtensionSettingKey(this.id, "browser"),
            getExtensionSettingKey(this.id, "searchResultStyle"),
            getExtensionSettingKey(this.id, "faviconApi"),
        ];
    }

    public getImageUrl(): string {
        return `file://${this.getAssetFilePath(this.getCurrentlyConfiguredBrowser())}`;
    }

    public getAssetFilePath(key: string): string {
        return this.getBrowserImageFilePath(key as Browser);
    }

    private getCurrentlyConfiguredBrowser(): Browser {
        return this.settingsManager.getValue<Browser>(
            getExtensionSettingKey("BrowserBookmarks", "browser"),
            this.getSettingDefaultValue("browser"),
        );
    }

    private getBrowserImageFilePath(key: Browser): string {
        const assetFileNames: Record<Browser, string> = {
            Arc: "arc.png",
            "Brave Browser": "brave-browser.png",
            "Google Chrome": "google-chrome.png",
            "Microsoft Edge": "microsoft-edge.png",
            "Yandex Browser": "yandex-browser.svg",
        };

        return this.assetPathResolver.getExtensionAssetPath(this.id, assetFileNames[key]);
    }
}
