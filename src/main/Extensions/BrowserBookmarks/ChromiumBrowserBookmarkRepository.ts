import type { FileSystemUtility } from "@Core/FileSystemUtility";
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
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly bookmarksFilePath: string,
    ) {}

    public async getAll(): Promise<BrowserBookmark[]> {
        const fileContent = await this.fileSystemUtility.readJsonFile<BookmarksFileContent>(this.bookmarksFilePath);
        return this.getBookmarksFromItem(fileContent.roots.bookmark_bar);
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
