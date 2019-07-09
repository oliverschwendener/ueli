import { ColorThemeOptions } from "../../common/config/color-theme-options";

const light: ColorThemeOptions = {
    name: "Light",

    userInputBackgroundColor: "#fff",
    userInputTextColor: "#000",

    searchResultsBackgroundColor: "#fff",

    searchResultsItemActiveBackgroundColor: "#1976D2",
    searchResultsItemActiveDescriptionColor: "#ccc",
    searchResultsItemActiveTextColor: "#fff",

    searchResultsItemDescriptionTextColor: "#666",
    searchResultsItemNameTextcolor: "#000",

    scrollbarBackgroundColor: "#ccc",
    scrollbarForegroundColor: "#858585",
};

const dark: ColorThemeOptions = {
    name: "Dark",

    userInputBackgroundColor: "#000",
    userInputTextColor: "#fff",

    searchResultsBackgroundColor: "#000",

    searchResultsItemActiveBackgroundColor: "#0078d7",
    searchResultsItemActiveDescriptionColor: "#ccc",
    searchResultsItemActiveTextColor: "#fff",

    searchResultsItemDescriptionTextColor: "#ccc",
    searchResultsItemNameTextcolor: "#fff",

    scrollbarBackgroundColor: "#222",
    scrollbarForegroundColor: "#444",
};

export const atomOneDark: ColorThemeOptions = {
    name: "Atom One Dark",

    userInputBackgroundColor: "#20252b",
    userInputTextColor: "#fff",

    searchResultsBackgroundColor: "#272c34",

    searchResultsItemActiveBackgroundColor: "#3d4452",
    searchResultsItemActiveDescriptionColor: "#fff",
    searchResultsItemActiveTextColor: "#fff",

    searchResultsItemDescriptionTextColor: "#ccc",
    searchResultsItemNameTextcolor: "#aab2c0",

    scrollbarBackgroundColor: "#1f2328",
    scrollbarForegroundColor: "#3d444f",
};

export const colorThemes: ColorThemeOptions[] = [
    atomOneDark,
    dark,
    light,
];
