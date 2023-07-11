import { platform } from "os";
import { getCurrentOperatingSystem } from "../helpers/operating-system-helpers";
import { OperatingSystem } from "../operating-system";

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
    userInputFontSize: string;
    userInputFontWeight: string;
    userInputBorderRadius: string;
    userInputBottomMargin: number;
    searchResultsBorderRadius: string;
    searchResultNameFontSize: string;
    searchResultNameFontWeight: string;
    searchResultDescriptionFontSize: string;
    searchResultDescriptionFontWeight: string;
    scrollbarBorderRadius: string;
}

const defaultFontFamily =
    getCurrentOperatingSystem(platform()) === OperatingSystem.Windows
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
    userInputBorderRadius: "0px",
    userInputFontSize: "24px",
    userInputFontWeight: "200",
    userInputBottomMargin: 0,
    searchResultNameFontSize: "16px",
    searchResultNameFontWeight: "400",
    searchResultDescriptionFontSize: "12px",
    searchResultDescriptionFontWeight: "200",
    searchResultsBorderRadius: "0px",
    scrollbarBorderRadius: "0px",
};
