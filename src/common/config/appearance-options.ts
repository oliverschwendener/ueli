import { platform } from "os";
import { isWindows } from "../helpers/operating-system-helpers";

export interface AppearanceOptions {
    maxSearchResultsPerPage: number;
    searchResultHeight: number;
    showDescriptionOnAllSearchResults: boolean;
    showSearchIcon: boolean;
    showSearchResultNumbers: boolean;
    smoothScrolling: boolean;
    userInputHeight: number;
    windowWidth: number;
    allowTransparentBackground: boolean;
    fontFamily: string;
}

const defaultFontFamily = isWindows(platform())
    ? `"Segoe UI", Roboto, "Segoe UI Emoji", "Segoe UI Symbol"`
    : `-apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif, "Apple Color Emoji`;

export const defaultAppearanceOptions: AppearanceOptions = {
    allowTransparentBackground: false,
    fontFamily: defaultFontFamily,
    maxSearchResultsPerPage: 8,
    searchResultHeight: 50,
    showDescriptionOnAllSearchResults: true,
    showSearchIcon: true,
    showSearchResultNumbers: false,
    smoothScrolling: true,
    userInputHeight: 60,
    windowWidth: 600,
};
