import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { UrlImageGenerator } from "@Core/ImageGenerator";
import type { Logger } from "@Core/Logger";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import type { WebBrowser, WebBrowserBookmark, WebBrowserRegistry } from "@Core/WebBrowser";
import {
    createCopyToClipboardAction,
    createOpenUrlSearchResultAction,
    type OperatingSystem,
    type SearchResultItem,
} from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";

type Settings = {
    browsers: string[];
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

    private readonly keyboardShortcuts: Record<OperatingSystem, Record<string, string>> = {
        Linux: { copyUrlToClipboard: "Ctrl+C" },
        macOS: { copyUrlToClipboard: "Cmd+C" },
        Windows: { copyUrlToClipboard: "Ctrl+C" },
    };

    public constructor(
        private readonly webBrowserRegistry: WebBrowserRegistry,
        private readonly settingsManager: SettingsManager,
        private readonly assetPathResolver: AssetPathResolver,
        private readonly operatingSystem: OperatingSystem,
        private readonly translator: Translator,
        private readonly urlImageGenerator: UrlImageGenerator,
        private readonly logger: Logger,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        let result: SearchResultItem[] = [];

        const promiseResult = await Promise.allSettled(
            this.getCurrentlyConfiguredBrowsers().map((webBrowser) => webBrowser.getBookmarks()),
        );

        for (let i = 0; i < promiseResult.length; i++) {
            const webBrowser = this.getCurrentlyConfiguredBrowsers()[i];
            const bookmarksResult = promiseResult[i];

            if (bookmarksResult.status === "fulfilled") {
                result = [
                    ...result,
                    ...bookmarksResult.value.map((b) => this.mapBookmarkToSearchResultItem(b, webBrowser)),
                ];
            } else {
                this.logger.error(
                    `Unable to get bookmarks for browser "${webBrowser.getName()}". Reason: ${bookmarksResult.reason}`,
                );
            }
        }

        return result;
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

    private mapBookmarkToSearchResultItem(
        browserBookmark: WebBrowserBookmark,
        webBrowser: WebBrowser,
    ): SearchResultItem {
        const { t } = this.translator.createT(this.getI18nResources());

        const iconType = this.settingsManager.getValue<string>(
            `extension[${this.id}].iconType`,
            this.defaultSettings["iconType"],
        );

        return {
            description: t("searchResultItemDescription", { browserName: webBrowser.getName() }),
            details: browserBookmark.getUrl(),
            defaultAction: createOpenUrlSearchResultAction({
                url: browserBookmark.getUrl(),
            }),
            id: browserBookmark.getId(),
            name: this.getName(browserBookmark),
            image:
                iconType === "browserIcon"
                    ? webBrowser.getImage()
                    : this.urlImageGenerator.getImage(browserBookmark.getUrl()),
            additionalActions: [
                createCopyToClipboardAction({
                    textToCopy: browserBookmark.getUrl(),
                    description: "Copy URL to clipboard",
                    descriptionTranslation: {
                        key: "copyUrlToClipboard",
                        namespace: "extension[BrowserBookmarks]",
                    },
                    keyboardShortcut: this.keyboardShortcuts[this.operatingSystem].copyUrlToClipboard,
                }),
            ],
        };
    }

    private getName(browserBookmark: WebBrowserBookmark): string {
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

    private getCurrentlyConfiguredBrowsers(): WebBrowser[] {
        const browserNames = this.settingsManager.getValue<string[]>(
            getExtensionSettingKey("BrowserBookmarks", "browsers"),
            <string[]>this.getSettingDefaultValue("browsers"),
        );

        return this.webBrowserRegistry.getByNames(browserNames);
    }
}
