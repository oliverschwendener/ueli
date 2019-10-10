import { Browser } from "../../main/plugins/browser-bookmarks-plugin/browser";

export interface BrowserBookmarksOptions {
    isEnabled: boolean;
    browser: Browser;
}

export const defaultBrowserBookmarksOptions: BrowserBookmarksOptions = {
    browser: Browser.GoogleChrome,
    isEnabled: true,
};
