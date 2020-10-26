import { SearchPlugin } from "../../search-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { BrowserBookmark } from "./browser-bookmark";
import { BrowserBookmarksOptions } from "../../../common/config/browser-bookmarks-options";
import { FileHelpers } from "../../../common/helpers/file-helpers";
import { isValidUrl } from "../../../common/helpers/url-helpers";
import { defaultBookmarkIcon } from "../../../common/icon/default-icons";
import { existsSync } from "fs";

export class BrowserBookmarksPlugin implements SearchPlugin {
    public readonly pluginType = PluginType.BrowserBookmarks;

    private config: BrowserBookmarksOptions;
    private translations: TranslationSet;
    private readonly urlExecutor: (url: string) => Promise<void>;
    private browserBookmarks: BrowserBookmark[];

    constructor(
        config: BrowserBookmarksOptions,
        translations: TranslationSet,
        urlExecutor: (url: string) => Promise<void>) {
        this.config = config;
        this.translations = translations;
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
            this.config = updatedConfig.browserBookmarksOptions;
            this.refreshIndex()
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    private getBrowserBookmarks(): Promise<BrowserBookmark[]> {
        return new Promise((resolve, reject) => {
            const bookmarksFilesPromises: Promise<string>[] = [];

            this.config.bookmarksFiles.forEach(async (file) => {
                const exists = existsSync(file);
                if (exists) {
                    bookmarksFilesPromises.push(FileHelpers.readFile(file));
                } else {
                    reject(`Bookmark file (${file}) does not exist`);
                }
            });

            Promise.all(bookmarksFilesPromises).then(bookmarksFilesData => {
                let bookmarks: BrowserBookmark[] = [];
                bookmarksFilesData.forEach(data => {
                    const jsonParsed = JSON.parse(data);
                    const rootsCombined = Object.values(jsonParsed.roots).reduce((combined: any, value: any) => {
                        if (value && value.children) {
                            combined.children = combined.children.concat(value.children);
                        }
                        return combined;
                    }, { children: [] });
                    bookmarks = [...this.getBookmarksFromObject(rootsCombined)];
                });

                resolve(bookmarks);
            }).catch(error => reject(error));
        });
    }

    private getBookmarksFromObject(data: any): any[] {
        let result: any[] = [];

        Object.entries(data).forEach(([key, v]) => {
            const value = v as any;
            if (key === "children") {
                const folders = value.filter((entry: any) => {
                    return entry.type
                        && entry.type === "folder";
                });

                const bookmarks = value.filter((entry: any) => {
                    return entry.type
                        && entry.type === "url"
                        && entry.url
                        && isValidUrl(entry.url);
                });

                result = result.concat(bookmarks);
                folders.forEach((folder: any) => result = result.concat(this.getBookmarksFromObject(folder)));
            }
        });

        return result;
    }

    private buildSearchResultItem(browserBookmark: BrowserBookmark): SearchResultItem {
        return {
            description: browserBookmark.name
                ? browserBookmark.url
                : `${this.translations.browserBookmark}`,
            executionArgument: browserBookmark.url,
            hideMainWindowAfterExecution: true,
            icon: defaultBookmarkIcon,
            name: browserBookmark.name || browserBookmark.url,
            needsUserConfirmationBeforeExecution: false,
            originPluginType: this.pluginType,
            searchable: [browserBookmark.name, browserBookmark.url],
        };
    }
}
