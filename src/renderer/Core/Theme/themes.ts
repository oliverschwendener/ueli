import { teamsDarkTheme, teamsLightTheme, webDarkTheme, webLightTheme } from "@fluentui/react-components";
import type { ThemeMap } from "./ThemeMap";

export const defaultTheme = {
    dark: webDarkTheme,
    light: webLightTheme,
};

export const themeMap: ThemeMap = {
    "Microsoft Teams": {
        dark: { theme: teamsDarkTheme, accentColor: "#7F85F5" },
        light: { theme: teamsLightTheme, accentColor: "#5B5FC7" },
    },
    "Fluent UI Web": {
        dark: { theme: webDarkTheme, accentColor: "#4F82C8" },
        light: { theme: webLightTheme, accentColor: "#1267B4" },
    },
};
