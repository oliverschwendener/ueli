import { OperatingSystem } from "../operating-system";
import { getCurrentOperatingSystem } from "../helpers/operating-system-helpers";
import { homedir, platform } from "os";
export interface BrowserBookmarksOptions {
    isEnabled: boolean;
    bookmarksFiles: string[];
}

export const defaultBrowserBookmarksOptions: BrowserBookmarksOptions = {
    bookmarksFiles: [getCurrentOperatingSystem(platform()) === OperatingSystem.Windows
        ? `${homedir()}\\AppData\\Local\\Vivaldi\\User Data\\Default\\Bookmarks`
        : `${homedir()}/Library/Application\ Support/Vivaldi/Default/Bookmarks`],
    isEnabled: true,
};
