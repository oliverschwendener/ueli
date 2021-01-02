import { BrowserBookmarkRepository } from "./browser-bookmark-repository";
import { BrowserBookmark } from "./browser-bookmark";
import { FileHelpers } from "../../../common/helpers/file-helpers";
import { isValidUrl } from "../../../common/helpers/url-helpers";
import { Browser } from "./browser";
import { IconType } from "../../../common/icon/icon-type";
import { Icon } from "../../../common/icon/icon";

export class GoogleChromeBookmarkRepository implements BrowserBookmarkRepository {
    public browser = Browser.GoogleChrome;
    public defaultIcon: Icon = {
        parameter: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m4.7 9.6c-1.1 2-1.7 4.2-1.7 6.4 0 6.4 4.6 11.8 11 12.8l3.8-6.5c-.4.1-1 .3-1.8.3-2.7 0-4.9-1.6-6-3.8z"/><path d="m5.7 8 3.8 6.2c1-3.1 3.7-4.9 6.5-4.9h11.1c-2.4-3.9-6.6-6.3-10.9-6.3s-8.1 1.8-10.5 5z"/><path d="m20.5 11.1c1.3 1.3 2.2 3 2.2 4.9 0 1.4-.4 2.6-1.2 3.8l-5.4 9.2c7.1-.1 12.9-5.9 12.9-13 0-1.7-.3-3.4-.9-4.9z"/><path d="m20.9 16c0 2.7-2.2 4.9-4.9 4.9s-4.9-2.2-4.9-4.9 2.2-4.9 4.9-4.9 4.9 2.2 4.9 4.9z"/></svg>`,
        type: IconType.SVG,
    };

    private readonly bookmarkFilePath: string;

    constructor(bookmarkFilePath: string) {
        this.bookmarkFilePath = bookmarkFilePath;
    }

    public getBrowserBookmarks(): Promise<BrowserBookmark[]> {
        return new Promise((resolve, reject) => {
            FileHelpers.fileExists(this.bookmarkFilePath)
                .then((exists) => {
                    if (exists) {
                        FileHelpers.readFile(this.bookmarkFilePath)
                            .then((data) => {
                                const jsonParsed = JSON.parse(data);
                                const rootsCombined = Object.values(jsonParsed.roots).reduce((combined: any, value: any) => {
                                    if (value && value.children) {
                                        combined.children = combined.children.concat(value.children)
                                    }
                                    return combined
                                }, { children: [] })
                                const bookmarks: BrowserBookmark[] = this.getBookmarksFromObject(rootsCombined);
                                resolve(bookmarks);
                            })
                            .catch((err) => reject(`Can't read bookmarks file: ${err}`));
                    } else {
                        reject(`Bookmark file (${this.bookmarkFilePath}) does not exist`);
                    }
                })
                .catch((err) => reject(err));
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
