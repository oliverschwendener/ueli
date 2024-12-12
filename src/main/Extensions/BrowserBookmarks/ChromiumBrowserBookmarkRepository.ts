import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { BrowserBookmark } from "./BrowserBookmark";
import type { BrowserBookmarkRepository } from "./BrowserBookmarkRepository";
import { ChromiumBrowserBookmark } from "./ChromiumBrowserBookmark";

type BookmarkItem = {
    children: BookmarkItem[];
    guid: string;
    name: string;
    type: "folder" | "url";
    url?: string;
};

type BookmarksFileContent = { roots: { bookmark_bar: BookmarkItem } };

export class ChromiumBrowserBookmarkRepository implements BrowserBookmarkRepository {
    public constructor(
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly bookmarksFilePathResolver: () => string,
    ) {}

    public async getAll(): Promise<BrowserBookmark[]> {
        const jsonFilePath = this.bookmarksFilePathResolver();
        const fileContent = await this.fileSystemUtility.readJsonFile<BookmarksFileContent>(jsonFilePath);
        return this.getBookmarksFromItem(fileContent.roots.bookmark_bar);
    }

    private getBookmarksFromItem(item: BookmarkItem): ChromiumBrowserBookmark[] {
        const bookmarks: ChromiumBrowserBookmark[] = [];

        for (const key of Object.keys(item)) {
            const value = item[key as keyof BookmarkItem];

            if (typeof value === "object" && value.length) {
                const folders = value.filter((entry: { type?: string }) => entry.type && entry.type === "folder");

                for (const entry of value) {
                    if (entry.type && entry.type === "url" && entry.url && entry.url.length) {
                        bookmarks.push(new ChromiumBrowserBookmark(entry.name, entry.url, entry.guid));
                    }
                }

                for (const folder of folders) {
                    for (const bookmark of this.getBookmarksFromItem(folder)) {
                        bookmarks.push(bookmark);
                    }
                }
            }
        }

        return bookmarks;
    }
}
