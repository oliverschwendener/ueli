import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { UrlImageGenerator } from "@Core/ImageGenerator";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import {
    createCopyToClipboardAction,
    createOpenUrlSearchResultAction,
    type OperatingSystem,
    type SearchResultItem,
} from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { Browser } from "@common/Extensions/BrowserBookmarks";
import type { BrowserBookmark } from "./BrowserBookmark";
import type { BrowserBookmarkRepository } from "./BrowserBookmarkRepository";

type Settings = {
    browsers: Browser[];
    searchResultStyle: string;
    iconType: string;
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
        browsers: [],
        searchResultStyle: "nameOnly",
        iconType: "favicon",
    };

    public constructor(
        private readonly browserBookmarkRepositories: Record<Browser, BrowserBookmarkRepository>,
        private readonly settingsManager: SettingsManager,
        private readonly assetPathResolver: AssetPathResolver,
        private readonly urlImageGenerator: UrlImageGenerator,
        private readonly operatingSystem: OperatingSystem,
        private readonly translator: Translator,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const { t } = this.translator.createT(this.getI18nResources());
        const browsers = this.getCurrentlyConfiguredBrowsers();

        const keyboardShortcuts: Record<OperatingSystem, Record<string, string>> = {
            Linux: { copyUrlToClipboard: "Ctrl+C" },
            macOS: { copyUrlToClipboard: "Cmd+C" },
            Windows: { copyUrlToClipboard: "Ctrl+C" },
        };

        const toSearchResultItem = (browserBookmark: BrowserBookmark, browserName: Browser): SearchResultItem => {
            return {
                description: t("searchResultItemDescription", { browserName }),
                details: browserBookmark.getUrl(),
                defaultAction: createOpenUrlSearchResultAction({
                    url: browserBookmark.getUrl(),
                }),
                id: browserBookmark.getId(),
                name: this.getName(browserBookmark),
                image: this.getBrowserBookmarkImage(browserBookmark, browserName),
                additionalActions: [
                    createCopyToClipboardAction({
                        textToCopy: browserBookmark.getUrl(),
                        description: "Copy URL to clipboard",
                        descriptionTranslation: {
                            key: "copyUrlToClipboard",
                            namespace: "extension[BrowserBookmarks]",
                        },
                        keyboardShortcut: keyboardShortcuts[this.operatingSystem].copyUrlToClipboard,
                    }),
                ],
            };
        };

        let result: SearchResultItem[] = [];

        for (const browser of browsers) {
            const repository: BrowserBookmarkRepository | undefined = this.browserBookmarkRepositories[browser];

            if (repository) {
                result = [...result, ...(await repository.getAll()).map((b) => toSearchResultItem(b, browser))];
            }
        }

        return result;
    }

    private getBrowserBookmarkImage(browserBookmark: BrowserBookmark, browser: Browser): Image {
        const iconType = this.settingsManager.getValue<string>(
            `extension[${this.id}].iconType`,
            this.defaultSettings["iconType"],
        );

        return iconType === "browserIcon"
            ? this.getBrowserImage(browser)
            : this.urlImageGenerator.getImage(browserBookmark.getUrl());
    }

    public isSupported(): boolean {
        return (<OperatingSystem[]>["Windows", "macOS"]).includes(this.operatingSystem);
    }

    public getSettingDefaultValue(key: keyof Settings) {
        return this.defaultSettings[key];
    }

    public getSettingKeysTriggeringRescan(): string[] {
        return [
            "general.language",
            "imageGenerator.faviconApiProvider",
            getExtensionSettingKey(this.id, "browsers"),
            getExtensionSettingKey(this.id, "searchResultStyle"),
            getExtensionSettingKey(this.id, "iconType"),
        ];
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "browser-bookmarks.png")}`,
        };
    }

    public getAssetFilePath(key: string): string {
        return this.getBrowserImageFilePath(key as Browser);
    }

    private getBrowserImage(browser: Browser): Image {
        return {
            url: `file://${this.getBrowserImageFilePath(browser)}`,
        };
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "Browser Bookmarks",
                "searchResultStyle.nameOnly": "Name only",
                "searchResultStyle.urlOnly": "URL only",
                "searchResultStyle.nameAndUrl": "Name & URL",
                selectBrowsers: "Select browsers",
                iconType: "Icon Type",
                "iconType.favicon": "Favicon",
                "iconType.browserIcon": "Browser icon",
                copyUrlToClipboard: "Copy URL to clipboard",
                searchResultItemDescription: "{{browserName}} Bookmark",
            },
            "de-CH": {
                extensionName: "Browserlesezeichen",
                "searchResultStyle.nameOnly": "Nur Name",
                "searchResultStyle.urlOnly": "Nur URL",
                "searchResultStyle.nameAndUrl": "Name & URL",
                selectBrowsers: "Browser auswählen",
                iconType: "Symboltyp",
                "iconType.favicon": "Favicon",
                "iconType.browserIcon": "Browsersymbol",
                copyUrlToClipboard: "URL in Zwischenablage kopieren",
                searchResultItemDescription: "{{browserName}} Lesezeichen",
            },
            "ja-JP": {
                extensionName: "ブラウザブックマーク",
                "searchResultStyle.nameOnly": "名前のみ",
                "searchResultStyle.urlOnly": "URLのみ",
                "searchResultStyle.nameAndUrl": "名前とURL",
                selectBrowsers: "ブラウザを選択",
                iconType: "アイコン",
                "iconType.favicon": "Favicon",
                "iconType.browserIcon": "ブラウザのアイコン",
                copyUrlToClipboard: "クリップボードからURLをコピー",
                searchResultItemDescription: "{{browserName}} ブックマーク | {{browserName}} Bookmark",
            },
            "ko-KR": {
                extensionName: "브라우저 북마크",
                "searchResultStyle.nameOnly": "이름만",
                "searchResultStyle.urlOnly": "URL만",
                "searchResultStyle.nameAndUrl": "이름과 URL",
                selectBrowsers: "브라우저 선택",
                iconType: "아이콘 유형",
                "iconType.favicon": "파비콘",
                "iconType.browserIcon": "브라우저 아이콘",
                copyUrlToClipboard: "클립보드에 URL 복사",
                searchResultItemDescription: "{{browserName}} 북마크",
            },
        };
    }

    private getName(browserBookmark: BrowserBookmark): string {
        const searchResultStyle = this.settingsManager.getValue<string>(
            getExtensionSettingKey(this.id, "searchResultStyle"),
            <string>this.getSettingDefaultValue("searchResultStyle"),
        );

        const names: Record<string, () => string> = {
            nameOnly: () => browserBookmark.getName(),
            urlOnly: () => browserBookmark.getUrl(),
            nameAndUrl: () => `${browserBookmark.getName()} - ${browserBookmark.getUrl()}`,
        };

        return Object.keys(names).includes(searchResultStyle) ? names[searchResultStyle]() : names["nameOnly"]();
    }

    private getCurrentlyConfiguredBrowsers(): Browser[] {
        return this.settingsManager.getValue<Browser[]>(
            getExtensionSettingKey("BrowserBookmarks", "browsers"),
            <Browser[]>this.getSettingDefaultValue("browsers"),
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
