import { BrowserBookmark } from "./browser-bookmark";
import { Browser } from "./browser";
import { Icon } from "../../../common/icon/icon";

export interface BrowserBookmarkRepository {
    browser: Browser;
    defaultIcon: Icon;
    getBrowserBookmarks(): Promise<BrowserBookmark[]>;
}
