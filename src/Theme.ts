import { Theme, webDarkTheme, webLightTheme } from "@fluentui/react-components";

export type ThemeName = "Web Dark" | "Web Light";

export const themeMap: Record<ThemeName, Theme> = {
    "Web Dark": webDarkTheme,
    "Web Light": webLightTheme,
};

export const getThemeName = (): ThemeName =>
    window.ContextBridge.themeShouldUseDarkColors() ? "Web Dark" : "Web Light";
