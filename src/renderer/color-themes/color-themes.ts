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

const polarNight: ColorThemeOptions = {
    name: "Polar Night",

    userInputBackgroundColor: "#2E3440",
    userInputTextColor: "#fefefe",

    searchResultsBackgroundColor: "#3B4252",

    searchResultsItemActiveBackgroundColor: "#4C566A",
    searchResultsItemActiveDescriptionColor: "#ccc",
    searchResultsItemActiveTextColor: "#fff",

    searchResultsItemDescriptionTextColor: "#ccc",
    searchResultsItemNameTextcolor: "#fff",

    scrollbarBackgroundColor: "#2E3440",
    scrollbarForegroundColor: "#4C566A",
};

const snowStorm: ColorThemeOptions = {
    name: "Snow Storm",

    userInputBackgroundColor: "#D8DEE9",
    userInputTextColor: "#2E3440",

    searchResultsBackgroundColor: "#E5E9F0",

    searchResultsItemActiveBackgroundColor: "#D8DEE9",
    searchResultsItemActiveDescriptionColor: "#4C566A",
    searchResultsItemActiveTextColor: "#2E3440",

    searchResultsItemDescriptionTextColor: "#4C566A",
    searchResultsItemNameTextcolor: "#2E3440",

    scrollbarBackgroundColor: "#D8DEE9",
    scrollbarForegroundColor: "#ECEFF4",
};

const shadesOfPurple: ColorThemeOptions = {
    name: "Shades Of Purple",

    userInputBackgroundColor: "#1e1e3f",
    userInputTextColor: "#b362ff",

    searchResultsBackgroundColor: "#1e1e3f",

    searchResultsItemActiveBackgroundColor: "#fad000",
    searchResultsItemActiveDescriptionColor: "#1e1e3f",
    searchResultsItemActiveTextColor: "#4d21fc",

    searchResultsItemDescriptionTextColor: "#4d21fc",
    searchResultsItemNameTextcolor: "#aab2c0",

    scrollbarBackgroundColor: "#1e1e3f",
    scrollbarForegroundColor: "#fad000",
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

export const colorThemes: ColorThemeOptions[] = [atomOneDark, dark, light, polarNight, snowStorm, shadesOfPurple];
