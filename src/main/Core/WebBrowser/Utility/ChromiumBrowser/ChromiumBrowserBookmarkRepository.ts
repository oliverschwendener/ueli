import type { FileSystemUtility } from "@Core/FileSystemUtility";
import { ChromiumBrowserBookmark } from "./ChromiumBrowserBookmark";
import type { BookmarkItem, ChromiumBrowserBookmarkFile } from "./ChromiumBrowserBookmarkFile";

export class ChromiumBrowserBookmarkRepository {
    public constructor(private readonly fileSystemUtility: FileSystemUtility) {}

    public async getAll(bookmarkFilePath: string): Promise<ChromiumBrowserBookmark[]> {
        const fileContent = await this.fileSystemUtility.readJsonFile<ChromiumBrowserBookmarkFile>(bookmarkFilePath);

        const bookmarkBarBookmarks = this.getBookmarksFromItem(fileContent.roots.bookmark_bar);
        const otherBookmarks = this.getBookmarksFromItem(fileContent.roots.other);

        return [...bookmarkBarBookmarks, ...otherBookmarks];
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
