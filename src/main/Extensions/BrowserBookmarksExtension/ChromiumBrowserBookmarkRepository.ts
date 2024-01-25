import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { OperatingSystem } from "@common/Core";
import type { Browser } from "@common/Extensions/BrowserBookmarks/Browser";
import type { App } from "electron";
import { join } from "path";
import type { BrowserBookmark } from "./BrowserBookmark";
import type { BrowserBookmarkRepository } from "./BrowserBookmarkRepository";
import { ChromiumBrowserBookmark } from "./ChromiumBrowserBookmark";

type BookmarkItem = {
    children: BookmarkItem[];
    date_added: string;
    date_last_used: string;
    date_modified: string;
    guid: string;
    id: string;
    name: string;
    type: "folder" | "url";
    url?: string;
};

type BookmarksFileContent = { roots: { bookmark_bar: BookmarkItem } };

export class ChromiumBrowserBookmarkRepository implements BrowserBookmarkRepository {
    public constructor(
        private readonly app: App,
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly operatingSystem: OperatingSystem,
    ) {}

    public async getAll(browser: Browser): Promise<BrowserBookmark[]> {
        const fileContent = await this.getBookmarksFileContent(browser);
        return this.getBookmarksFromItem(fileContent.roots.bookmark_bar);
    }

    private getBookmarksFilePath(browser: Browser): string {
        const map: Record<OperatingSystem, Record<Browser, string>> = {
            Linux: null, // not supported,
            macOS: {
                Arc: join(this.app.getPath("appData"), "Arc", "User Data", "Default", "Bookmarks"),
                "Brave Browser": join(
                    this.app.getPath("appData"),
                    "BraveSoftware",
                    "Brave-Browser",
                    "Default",
                    "Bookmarks",
                ),
                "Google Chrome": join(this.app.getPath("appData"), "Google", "Chrome", "Default", "Bookmarks"),
                "Microsoft Edge": join(this.app.getPath("appData"), "Microsoft Edge", "Default", "Bookmarks"),
            },
            Windows: {
                Arc: "",
                "Brave Browser": join(
                    this.app.getPath("home"),
                    "AppData",
                    "Local",
                    "BraveSoftware",
                    "Brave-Browser",
                    "User Data",
                    "Default",
                    "Bookmarks",
                ),
                "Google Chrome": join(
                    this.app.getPath("home"),
                    "AppData",
                    "Local",
                    "Arc",
                    "User Data",
                    "Default",
                    "Bookmarks",
                ),
                "Microsoft Edge": join(
                    this.app.getPath("home"),
                    "AppData",
                    "Local",
                    "Microsoft Edge",
                    "User Data",
                    "Default",
                    "Bookmarks",
                ),
            },
        };

        return map[this.operatingSystem][browser];
    }

    private async getBookmarksFileContent(browser: Browser): Promise<BookmarksFileContent> {
        return await this.fileSystemUtility.readJsonFile<BookmarksFileContent>(this.getBookmarksFilePath(browser));
    }

    private getBookmarksFromItem(item: BookmarkItem): ChromiumBrowserBookmark[] {
        let result: ChromiumBrowserBookmark[] = [];

        for (const key of Object.keys(item)) {
            const value = item[key];

            if (typeof value === "object" && value.length) {
                const folders = value.filter((entry) => {
                    return entry.type && entry.type === "folder";
                });

                const bookmarks = value.filter(
                    (entry: BookmarkItem) => entry.type && entry.type === "url" && entry.url && entry.url.length,
                );

                result = result.concat(
                    bookmarks.map(
                        (item: BookmarkItem) => new ChromiumBrowserBookmark(item.name, item.url, item.guid, item.id),
                    ),
                );

                for (const folder of folders) {
                    result = result.concat(this.getBookmarksFromItem(folder));
                }
            }
        }

        return result;
    }
}
