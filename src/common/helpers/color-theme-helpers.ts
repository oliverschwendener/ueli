import { ColorThemeOptions } from "../config/color-theme-options";
import { isValidColorCode } from "../../main/plugins/color-converter-plugin/color-converter-helpers";

export function isValidColorTheme(colorThemeOptions: ColorThemeOptions): boolean {
    const colorValues = [
        colorThemeOptions.scrollbarBackgroundColor,
        colorThemeOptions.scrollbarForegroundColor,
        colorThemeOptions.searchResultsBackgroundColor,
        colorThemeOptions.searchResultsItemActiveBackgroundColor,
        colorThemeOptions.searchResultsItemActiveDescriptionColor,
        colorThemeOptions.searchResultsItemActiveTextColor,
        colorThemeOptions.searchResultsItemDescriptionTextColor,
        colorThemeOptions.searchResultsItemNameTextcolor,
        colorThemeOptions.userInputBackgroundColor,
        colorThemeOptions.userInputTextColor,
    ];

    return colorValues.every((colorValue) => isValidColorCode(colorValue));
}
