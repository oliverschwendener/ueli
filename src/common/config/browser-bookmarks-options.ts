export enum Browser {
    GoogleChrome = "Google Chrome",
    MozillaFirefox = "Mozilla Firefox",
    Safari = "Safari",
}

export interface BrowserBookmarksOptions {
    isEnabled: boolean;
    browser: Browser;
}

export const defaultBrowserBookmarksOptions: BrowserBookmarksOptions = {
    browser: Browser.GoogleChrome,
    isEnabled: false,
};
