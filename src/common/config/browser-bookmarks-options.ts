export enum Browser {
    GoogleChrome = "Google Chrome",
    MozillaFirefox = "Mozilla Firefox",
    Safari = "Safari",
}

export interface BrowserBookmarksOptions {
    isEnabled: boolean;
    browser: Browser;
}
