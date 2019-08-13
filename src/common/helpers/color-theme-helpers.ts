import { ColorThemeOptions } from "../config/color-theme-options";

export function isValidColorTheme(colorThemeOptions: ColorThemeOptions): boolean {
    return Object
        .values(colorThemeOptions)
        .every((value) => isValidHexColor(value));
}

function isValidHexColor(value: string): boolean {
    return new RegExp(/#[a-fA-F0-9]{3,6}/).test(value);
}
