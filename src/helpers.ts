import { Theme, webDarkTheme, webLightTheme } from "@fluentui/react-components";
import { ThemeName } from "./Theme";

export const themeMap: Record<ThemeName, Theme> = {
    "Web Dark": webDarkTheme,
    "Web Light": webLightTheme,
};

export const getThemeName = (): ThemeName =>
    window.ContextBridge.themeShouldUseDarkColors() ? "Web Dark" : "Web Light";
