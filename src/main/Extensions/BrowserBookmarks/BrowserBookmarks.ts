import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { UrlImageGenerator } from "@Core/ImageGenerator";
import type { SettingsManager } from "@Core/SettingsManager";
import { SearchResultItemActionUtility, type OperatingSystem, type SearchResultItem } from "@common/Core";
import { getExtensionSettingKey, type Translations } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { Browser } from "@common/Extensions/BrowserBookmarks";
import type { BrowserBookmark } from "./BrowserBookmark";
import type { BrowserBookmarkRepository } from "./BrowserBookmarkRepository";

type Settings = {
    browser: Browser;
    searchResultStyle: string;
};

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

    private readonly defaultSettings: Settings = {
        browser: "Google Chrome",
        searchResultStyle: "nameOnly",
    };

    public constructor(
        private readonly browserBookmarkRepositories: Record<Browser, BrowserBookmarkRepository>,
        private readonly settingsManager: SettingsManager,
        private readonly assetPathResolver: AssetPathResolver,
        private readonly urlImageGenerator: UrlImageGenerator,
        private readonly operatingSystem: OperatingSystem,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const browserBookmarks = await this.browserBookmarkRepositories[this.getCurrentlyConfiguredBrowser()].getAll();
        return browserBookmarks.map((browserBookmark) => this.toSearchResultItem(browserBookmark));
    }

    public isSupported(): boolean {
        return (<OperatingSystem[]>["Windows", "macOS"]).includes(this.operatingSystem);
    }

    public getSettingDefaultValue<T>(key: string): T {
        return this.defaultSettings[key] as T;
    }

    public getSettingKeysTriggeringRescan(): string[] {
        return [
            "imageGenerator.faviconApiProvider",
            getExtensionSettingKey(this.id, "browser"),
            getExtensionSettingKey(this.id, "searchResultStyle"),
        ];
    }

    public getImage(): Image {
        return {
            url: `file://${this.getAssetFilePath(this.getCurrentlyConfiguredBrowser())}`,
        };
    }

    public getAssetFilePath(key: string): string {
        return this.getBrowserImageFilePath(key as Browser);
    }

    public getTranslations(): Translations {
        return {
            "en-US": {
                extensionName: "Browser Bookmarks",
                "searchResultStyle.nameOnly": "Name only",
                "searchResultStyle.urlOnly": "URL only",
                "searchResultStyle.nameAndUrl": "Name & URL",
                copyUrlToClipboard: "Copy URL to clipboard",
            },
            "de-CH": {
                extensionName: "Browserlesezeichen",
                "searchResultStyle.nameOnly": "Nur Name",
                "searchResultStyle.urlOnly": "Nur URL",
                "searchResultStyle.nameAndUrl": "Name & URL",
                copyUrlToClipboard: "URL in Zwischenablage kopieren",
            },
        };
    }

    private toSearchResultItem(browserBookmark: BrowserBookmark): SearchResultItem {
        return {
            description: "Browser Bookmark",
            defaultAction: SearchResultItemActionUtility.createOpenUrlSearchResultAction({
                url: browserBookmark.getUrl(),
            }),
            id: browserBookmark.getId(),
            name: this.getName(browserBookmark),
            image: this.urlImageGenerator.getImage(browserBookmark.getUrl()),
            additionalActions: [
                SearchResultItemActionUtility.createCopyToClipboardAction({
                    textToCopy: browserBookmark.getUrl(),
                    description: "Copy URL to clipboard",
                    descriptionTranslation: {
                        key: "copyUrlToClipboard",
                        namespace: "extension[BrowserBookmarks]",
                    },
                }),
            ],
        };
    }

    private getName(browserBookmark: BrowserBookmark): string {
        const searchResultStyle = this.settingsManager.getValue<string>(
            getExtensionSettingKey(this.id, "searchResultStyle"),
            this.getSettingDefaultValue("searchResultStyle"),
        );

        const names: Record<string, () => string> = {
            nameOnly: () => browserBookmark.getName(),
            urlOnly: () => browserBookmark.getUrl(),
            nameAndUrl: () => `${browserBookmark.getName()} - ${browserBookmark.getUrl()}`,
        };

        return Object.keys(names).includes(searchResultStyle) ? names[searchResultStyle]() : names["nameOnly"]();
    }

    private getCurrentlyConfiguredBrowser(): Browser {
        return this.settingsManager.getValue<Browser>(
            getExtensionSettingKey("BrowserBookmarks", "browser"),
            this.getSettingDefaultValue("browser"),
        );
    }

    private getBrowserImageFilePath(key: Browser): string {
        const assetFileNames: Record<Browser, string> = {
            Firefox: "firefox.png",
            Arc: "arc.png",
            "Brave Browser": "brave-browser.png",
            "Google Chrome": "google-chrome.png",
            "Microsoft Edge": "microsoft-edge.png",
            "Yandex Browser": "yandex-browser.svg",
        };

        return this.assetPathResolver.getExtensionAssetPath(this.id, assetFileNames[key]);
    }
}
