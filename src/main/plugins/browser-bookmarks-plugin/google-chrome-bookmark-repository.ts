import { BrowserBookmarkRepository } from "./browser-bookmark-repository";
import { BrowserBookmark } from "./browser-bookmark";
import { FileHelpers } from "../../../common/helpers/file-helpers";
import { isValidUrl } from "../../../common/helpers/url-helpers";
import { Browser } from "./browser";

export class GoogleChromeBookmarkRepository implements BrowserBookmarkRepository {
    public readonly browser = Browser.GoogleChrome;
    private readonly bookmarkFilePath: string;

    constructor(bookmarkFilePath: string) {
        this.bookmarkFilePath = bookmarkFilePath;
    }

    public getBrowserBookmarks(): Promise<BrowserBookmark[]> {
        return new Promise((resolve, reject) => {
            FileHelpers.readFile(this.bookmarkFilePath)
                .then((data) => {
                    const jsonParsed = JSON.parse(data);
                    const bookmarks: BrowserBookmark[] = this.getBookmarksFromObject(jsonParsed.roots.bookmark_bar);

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
}
