import type { Browser } from "@common/Extensions/BrowserBookmarks";
import type { BrowserBookmark } from "./BrowserBookmark";

export interface BrowserBookmarkRepository {
    getAll(browser: Browser): Promise<BrowserBookmark[]>;
}
