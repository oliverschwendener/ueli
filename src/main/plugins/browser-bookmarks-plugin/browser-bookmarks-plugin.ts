import { SearchPlugin } from "../../search-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { FileHelpers } from "../../../common/helpers/file-helpers";
import { homedir } from "os";
import { defaultBookmarkIcon } from "../../../common/icon/default-icons";
import { isValidUrl } from "../../../common/helpers/url-helpers";
import { Bookmark } from "./bookmark";

export class BrowserBookmarksPlugin implements SearchPlugin {
    public readonly pluginType = PluginType.BrowserBookmarks;
    private readonly urlExecutor: (url: string) => Promise<void>;
    private bookmarks: Bookmark[];

    constructor(urlExecutor: (url: string) => Promise<void>) {
        this.urlExecutor = urlExecutor;
        this.bookmarks = [];
    }

    public getAll(): Promise<SearchResultItem[]> {
        return new Promise((resolve) => {
            resolve(this.bookmarks.map((bookmark) => this.buildSearchResultItem(bookmark)));
        });
    }

    public refreshIndex(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.getBookmarks()
                .then((result) => {
                    this.bookmarks = result;
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
        return true;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return this.urlExecutor(searchResultItem.executionArgument);
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            resolve();
        });
    }

    private getBookmarks(): Promise<Bookmark[]> {
        return new Promise((resolve, reject) => {
            FileHelpers.readFile(`${homedir()}/Library/Application\ Support/Google/Chrome/Default/Bookmarks`)
                .then((data) => {
                    const jsonParsed = JSON.parse(data);
                    const bookmarks: Bookmark[] = this.getBookmarksFromObject(jsonParsed.roots.bookmark_bar);

                    resolve(bookmarks);
                })
                .catch((err) => reject(`Can't read bookmarks file: ${err}`));
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

    private buildSearchResultItem(bookmark: Bookmark): SearchResultItem {
        return {
            description: bookmark.name ? bookmark.url : "Google Chrome Bookmark",
            executionArgument: bookmark.url,
            hideMainWindowAfterExecution: true,
            icon: defaultBookmarkIcon,
            name: bookmark.name || bookmark.url,
            needsUserConfirmationBeforeExecution: false,
            originPluginType: this.pluginType,
            searchable: [bookmark.name, bookmark.url],
        };
    }
}
