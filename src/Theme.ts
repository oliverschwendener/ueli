import type { ContextBridge } from "@common/ContextBridge";
import { teamsDarkTheme, teamsLightTheme, webDarkTheme, webLightTheme, type Theme } from "@fluentui/react-components";

export type ThemeName = "Web Dark" | "Web Light" | "Teams Light" | "Teams Dark";

export const SYNC_WITH_OS_SETTING_KEY = "appearance.syncWithOs";
export const PREFERRED_THEME_NAME_SETTING_KEY = "appearance.preferredThemeName";
export const PREFERRED_LIGHT_THEME_NAME_SETTING_KEY = "appearance.preferredLightThemeName";
export const PREFERRED_DARK_THEME_NAME_SETTING_KEY = "appearance.preferredDarkThemeName";

const themeMap: Record<ThemeName, Theme> = {
    "Web Dark": webDarkTheme,
    "Web Light": webLightTheme,
    "Teams Dark": teamsDarkTheme,
    "Teams Light": teamsLightTheme,
};

const getThemeName = (contextBridge: ContextBridge): ThemeName => {
    const syncWithOs = contextBridge.getSettingByKey<boolean>(SYNC_WITH_OS_SETTING_KEY, true);

    const preferredThemeName = contextBridge.getSettingByKey<ThemeName>(PREFERRED_THEME_NAME_SETTING_KEY, "Web Dark");

    const preferredLightThemeName = contextBridge.getSettingByKey<ThemeName>(
        PREFERRED_LIGHT_THEME_NAME_SETTING_KEY,
        "Web Light",
    );

    const preferredDarkThemeName = contextBridge.getSettingByKey<ThemeName>(
        PREFERRED_DARK_THEME_NAME_SETTING_KEY,
        "Web Dark",
    );

    if (syncWithOs) {
        return contextBridge.themeShouldUseDarkColors() ? preferredDarkThemeName : preferredLightThemeName;
    }

    return preferredThemeName;
};

export const getTheme = (contextBridge: ContextBridge): Theme => themeMap[getThemeName(contextBridge)];
