import { Theme, teamsDarkTheme, teamsLightTheme, webDarkTheme, webLightTheme } from "@fluentui/react-components";

export type ThemeName = "Web Dark" | "Web Light" | "Teams Light" | "Teams Dark";

export const SYNC_WITH_OS_SETTING_KEY = "appearance.syncWithOs";
export const PREFERRED_THEME_SETTING_KEY = "appearance.preferredThemeName";
export const PREFERRED_LIGHT_THEME_SETTING_KEY = "appearance.preferredLightThemeName";
export const PREFERRED_DARK_THEME_SETTING_KEY = "appearance.preferredDarkThemeName";

const themeMap: Record<ThemeName, Theme> = {
    "Web Dark": webDarkTheme,
    "Web Light": webLightTheme,
    "Teams Dark": teamsDarkTheme,
    "Teams Light": teamsLightTheme,
};

const getThemeName = (): ThemeName => {
    const syncWithOs = window.ContextBridge.getSettingByKey(SYNC_WITH_OS_SETTING_KEY, true);

    const osPrefersDarkColors = window.ContextBridge.themeShouldUseDarkColors();

    const preferredThemeName = window.ContextBridge.getSettingByKey(
        PREFERRED_THEME_SETTING_KEY,
        <ThemeName>"Web Light",
    );

    const preferredLightThemeName = window.ContextBridge.getSettingByKey(
        PREFERRED_LIGHT_THEME_SETTING_KEY,
        <ThemeName>"Web Light",
    );

    const preferredDarkThemeName = window.ContextBridge.getSettingByKey(
        PREFERRED_DARK_THEME_SETTING_KEY,
        <ThemeName>"Web Dark",
    );

    if (syncWithOs) {
        return osPrefersDarkColors ? preferredDarkThemeName : preferredLightThemeName;
    }

    return preferredThemeName;
};

export const getTheme = (): Theme => themeMap[getThemeName()];
