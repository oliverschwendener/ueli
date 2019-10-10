import { BrowserBookmark } from "./browser-bookmark";
import { Browser } from "./browser";

export interface BrowserBookmarkRepository {
    browser: Browser;
    getBrowserBookmarks(): Promise<BrowserBookmark[]>;
}
