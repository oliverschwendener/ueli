import {
    BrandVariants,
    createDarkTheme,
    createLightTheme,
    teamsDarkTheme,
    teamsLightTheme,
    webDarkTheme,
    webLightTheme,
} from "@fluentui/react-components";
import { ThemeMap } from "./ThemeMap";

// Create custom themes using this designer: https://react.fluentui.dev/?path=/docs/theme-theme-designer--page
const ueliColors: BrandVariants = {
    10: "#010403",
    20: "#091D18",
    30: "#063027",
    40: "#013E32",
    50: "#004C3D",
    60: "#005A49",
    70: "#006855",
    80: "#007762",
    90: "#00876F",
    100: "#00967C",
    110: "#00A689",
    120: "#0EB697",
    130: "#24C6A5",
    140: "#36D6B4",
    150: "#48E6C2",
    160: "#5AF6D2",
};

export const defaultTheme = {
    dark: webDarkTheme,
    light: webLightTheme,
};

export const themeMap: ThemeMap = {
    "Microsoft Teams": { dark: teamsDarkTheme, light: teamsLightTheme },
    Ueli: { dark: createDarkTheme(ueliColors), light: createLightTheme(ueliColors) },
    "Fluent UI Web": { dark: webDarkTheme, light: webLightTheme },
};
