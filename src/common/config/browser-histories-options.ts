import { Browser } from "../../main/plugins/browser-bookmarks-plugin/browser";

export interface BrowserHistoryOptions {
    isEnabled: boolean;
    browser: Browser;
}

export const defaultBrowserHistoryOptions: BrowserHistoryOptions = {
    browser: Browser.GoogleChrome,
    isEnabled: true,
};
