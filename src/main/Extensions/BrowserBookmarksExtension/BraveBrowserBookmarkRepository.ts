import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { OperatingSystem } from "@common/Core";
import type { App } from "electron";
import { join } from "path";
import { BraveBrowserBookmark } from "./BraveBrowserBookmark";
import type { BrowserBookmark } from "./BrowserBookmark";
import type { BrowserBookmarkRepository } from "./BrowserBookmarkRepository";

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

export class BraveBrowserBookmarkRepository implements BrowserBookmarkRepository {
    public constructor(
        private readonly app: App,
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly operatingSystem: OperatingSystem,
    ) {}

    public async getAll(): Promise<BrowserBookmark[]> {
        const fileContent = await this.getBookmarksFileContent();
        return this.getBookmarksFromItem(fileContent.roots.bookmark_bar);
    }

    private getBookmarksFilePath(): string {
        const map: Record<OperatingSystem, string> = {
            Linux: null, // not supported,
            macOS: join(this.app.getPath("appData"), "BraveSoftware", "Brave-Browser", "Default", "Bookmarks"),
            Windows: join(
                this.app.getPath("home"),
                "AppData",
                "Local",
                "BraveSoftware",
                "Brave-Browser",
                "User Data",
                "Default",
                "Bookmarks",
            ),
        };

        return map[this.operatingSystem];
    }

    private async getBookmarksFileContent(): Promise<BookmarksFileContent> {
        return await this.fileSystemUtility.readJsonFile<BookmarksFileContent>(this.getBookmarksFilePath());
    }

    private getBookmarksFromItem(item: BookmarkItem): BraveBrowserBookmark[] {
        let result: BraveBrowserBookmark[] = [];

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
                        (item: BookmarkItem) => new BraveBrowserBookmark(item.name, item.url, item.guid, item.id),
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
