import { SearchPlugin } from "../../search-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { BrowserBookmark } from "./browser-bookmark";
import { BrowserBookmarksOptions } from "../../../common/config/browser-bookmarks-options";
import { BrowserBookmarkRepository } from "./browser-bookmark-repository";

export class BrowserBookmarksPlugin implements SearchPlugin {
    public readonly pluginType = PluginType.BrowserBookmarks;

    private config: BrowserBookmarksOptions;
    private translations: TranslationSet;
    private readonly browserBookmarkRepositories: BrowserBookmarkRepository[];
    private readonly urlExecutor: (url: string) => Promise<void>;
    private browserBookmarks: BrowserBookmark[];

    constructor(
        config: BrowserBookmarksOptions,
        translations: TranslationSet,
        browserBookmarkRepositories: BrowserBookmarkRepository[],
        urlExecutor: (url: string) => Promise<void>,
    ) {
        this.config = config;
        this.translations = translations;
        this.browserBookmarkRepositories = browserBookmarkRepositories;
        this.urlExecutor = urlExecutor;
        this.browserBookmarks = [];
    }

    public getAll(): Promise<SearchResultItem[]> {
        return new Promise((resolve) => {
            resolve(this.browserBookmarks.map((bookmark) => this.buildSearchResultItem(bookmark)));
        });
    }

    public refreshIndex(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.getBrowserBookmarks()
                .then((result) => {
                    this.browserBookmarks = result;
                    resolve();
                })
                .catch((err) => reject(err));
        });
    }

    public clearCache(): Promise<void> {
        return new Promise((resolve) => {
            resolve();
        });
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return this.urlExecutor(searchResultItem.executionArgument);
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve, reject) => {
            this.translations = translationSet;

            const browserChanged = updatedConfig.browserBookmarksOptions.browser !== this.config.browser;

            if (browserChanged) {
                this.config = updatedConfig.browserBookmarksOptions;
                this.refreshIndex()
                    .then(() => resolve())
                    .catch((err) => reject(err));
            } else {
                this.config = updatedConfig.browserBookmarksOptions;
                resolve();
            }
        });
    }

    private getBrowserBookmarks(): Promise<BrowserBookmark[]> {
        return this.getMatchingBrowserBookmarkRepository().getBrowserBookmarks();
    }

    private getMatchingBrowserBookmarkRepository(): BrowserBookmarkRepository {
        const matchingBookmarkRepository = this.browserBookmarkRepositories.find(
            (bookmarkRepository) => bookmarkRepository.browser === this.config.browser,
        );

        if (matchingBookmarkRepository) {
            return matchingBookmarkRepository;
        }

        throw new Error(`Unsupported browser: ${this.config.browser}`);
    }

    private buildSearchResultItem(browserBookmark: BrowserBookmark): SearchResultItem {
        return {
            description: browserBookmark.name
                ? browserBookmark.url
                : `${this.config.browser} ${this.translations.browserBookmark}`,
            executionArgument: browserBookmark.url,
            hideMainWindowAfterExecution: true,
            icon: this.getMatchingBrowserBookmarkRepository().defaultIcon,
            name: browserBookmark.name || browserBookmark.url,
            needsUserConfirmationBeforeExecution: false,
            originPluginType: this.pluginType,
            searchable: [browserBookmark.name, browserBookmark.url],
        };
    }
}
