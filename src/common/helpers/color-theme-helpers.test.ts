import { isValidColorTheme } from "./color-theme-helpers";
import { ColorThemeOptions } from "../config/color-theme-options";

describe(isValidColorTheme, () => {
    const validHexCodes = ["#fff", "#FFF", "#000", "#000000", "#00FFAA"];

    const invalidHexCodes = ["fff", "FFF", "#F", "#FF", "#FFFFFFF", "01324", "", "#FFFFFG"];

    it("should return true when given color theme contains valid hex values", () => {
        validHexCodes.forEach((validHexCode) => {
            const colorTheme: ColorThemeOptions = {
                name: "Test color theme",
                scrollbarBackgroundColor: validHexCode,
                scrollbarForegroundColor: validHexCode,
                searchResultsBackgroundColor: validHexCode,
                searchResultsItemActiveBackgroundColor: validHexCode,
                searchResultsItemActiveDescriptionColor: validHexCode,
                searchResultsItemActiveTextColor: validHexCode,
                searchResultsItemDescriptionTextColor: validHexCode,
                searchResultsItemNameTextcolor: validHexCode,
                userInputBackgroundColor: validHexCode,
                userInputTextColor: validHexCode,
            };

            expect(isValidColorTheme(colorTheme)).toBe(true);
        });
    });

    it("should return false when given color theme contains invalid hex value", () => {
        for (const invalidHexCode of invalidHexCodes) {
            const colorTheme: ColorThemeOptions = {
                name: "Test Color theme",
                scrollbarBackgroundColor: validHexCodes[0],
                scrollbarForegroundColor: validHexCodes[0],
                searchResultsBackgroundColor: validHexCodes[0],
                searchResultsItemActiveBackgroundColor: validHexCodes[0],
                searchResultsItemActiveDescriptionColor: validHexCodes[0],
                searchResultsItemActiveTextColor: validHexCodes[0],
                searchResultsItemDescriptionTextColor: validHexCodes[0],
                searchResultsItemNameTextcolor: validHexCodes[0],
                userInputBackgroundColor: validHexCodes[0],
                userInputTextColor: invalidHexCode,
            };

            expect(isValidColorTheme(colorTheme)).toBe(false);
        }
    });
});
