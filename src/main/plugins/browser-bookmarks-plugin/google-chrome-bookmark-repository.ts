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
        parameter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#4caf50" d="M44,24c0,11.044-8.956,20-20,20S4,35.044,4,24S12.956,4,24,4S44,12.956,44,24z"></path><path fill="#ffc107" d="M24,4v20l8,4l-8.843,16c0.317,0,0.526,0,0.843,0c11.053,0,20-8.947,20-20S35.053,4,24,4z"></path><path fill="#4caf50" d="M44,24c0,11.044-8.956,20-20,20S4,35.044,4,24S12.956,4,24,4S44,12.956,44,24z"></path><path fill="#ffc107" d="M24,4v20l8,4l-8.843,16c0.317,0,0.526,0,0.843,0c11.053,0,20-8.947,20-20S35.053,4,24,4z"></path><path fill="#f44336" d="M41.84,15H24v13l-3-1L7.16,13.26H7.14C10.68,7.69,16.91,4,24,4C31.8,4,38.55,8.48,41.84,15z"></path><path fill="#dd2c00" d="M7.158,13.264l8.843,14.862L21,27L7.158,13.264z"></path><path fill="#558b2f" d="M23.157,44l8.934-16.059L28,25L23.157,44z"></path><path fill="#f9a825" d="M41.865,15H24l-1.579,4.58L41.865,15z"></path><path fill="#fff" d="M33,24c0,4.969-4.031,9-9,9s-9-4.031-9-9s4.031-9,9-9S33,19.031,33,24z"></path><path fill="#2196f3" d="M31,24c0,3.867-3.133,7-7,7s-7-3.133-7-7s3.133-7,7-7S31,20.133,31,24z"></path></svg>`,
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
                                const rootsCombined = Object.values(jsonParsed.roots).reduce(
                                    (combined: any, value: any) => {
                                        if (value && value.children) {
                                            combined.children = combined.children.concat(value.children);
                                        }
                                        return combined;
                                    },
                                    { children: [] },
                                );
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
                    return entry.type && entry.type === "folder";
                });

                const bookmarks = value.filter((entry: any) => {
                    return entry.type && entry.type === "url" && entry.url && isValidUrl(entry.url);
                });

                result = result.concat(bookmarks);
                folders.forEach((folder: any) => (result = result.concat(this.getBookmarksFromObject(folder))));
            }
        });

        return result;
    }
}
