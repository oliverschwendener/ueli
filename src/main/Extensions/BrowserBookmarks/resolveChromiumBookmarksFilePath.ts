import type { OperatingSystem } from "@common/Core";
import type { ChromiumBrowser } from "@common/Extensions/BrowserBookmarks";
import type { App } from "electron";
import { join } from "path";

export const resolveChromiumBookmarksFilePath = ({
    browser,
    operatingSystem,
    app,
}: {
    browser: ChromiumBrowser;
    operatingSystem: OperatingSystem;
    app: App;
}): string => {
    const map: Record<ChromiumBrowser, Record<OperatingSystem, () => string>> = {
        Arc: {
            Linux: () => "", // not supported,
            Windows: () => join(app.getPath("home"), "AppData", "Local", "Arc", "User Data", "Default", "Bookmarks"),
            macOS: () => join(app.getPath("appData"), "Arc", "User Data", "Default", "Bookmarks"),
        },
        "Brave Browser": {
            Linux: () => "", // not supported,
            macOS: () => join(app.getPath("appData"), "BraveSoftware", "Brave-Browser", "Default", "Bookmarks"),
            Windows: () =>
                join(
                    app.getPath("home"),
                    "AppData",
                    "Local",
                    "BraveSoftware",
                    "Brave-Browser",
                    "User Data",
                    "Default",
                    "Bookmarks",
                ),
        },
        "Google Chrome": {
            Linux: () => "", // not supported,,
            macOS: () => join(app.getPath("appData"), "Google", "Chrome", "Default", "Bookmarks"),
            Windows: () =>
                join(app.getPath("home"), "AppData", "Local", "Google", "Chrome", "User Data", "Default", "Bookmarks"),
        },
        "Microsoft Edge": {
            Linux: () => "", // not supported,
            macOS: () => join(app.getPath("appData"), "Microsoft Edge", "Default", "Bookmarks"),
            Windows: () =>
                join(app.getPath("home"), "AppData", "Local", "Microsoft", "Edge", "User Data", "Default", "Bookmarks"),
        },
        "Yandex Browser": {
            Linux: () => "", // not supported,
            macOS: () => join(app.getPath("appData"), "Yandex", "YandexBrowser", "Default", "Bookmarks"),
            Windows: () =>
                join(
                    app.getPath("home"),
                    "AppData",
                    "Local",
                    "Yandex",
                    "YandexBrowser",
                    "User Data",
                    "Default",
                    "Bookmarks",
                ),
        },
    };

    return map[browser][operatingSystem]();
};
