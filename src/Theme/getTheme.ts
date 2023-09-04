import type { ContextBridge } from "@common/ContextBridge";
import { teamsDarkTheme, teamsLightTheme, webDarkTheme, webLightTheme, type Theme } from "@fluentui/react-components";
import type { ThemeName } from "./ThemeName";

const themeMap: Record<ThemeName, Theme> = {
    "Web Dark": webDarkTheme,
    "Web Light": webLightTheme,
    "Teams Dark": teamsDarkTheme,
    "Teams Light": teamsLightTheme,
};

const getThemeName = (contextBridge: ContextBridge): ThemeName => {
    const syncWithOs = contextBridge.getSettingByKey<boolean>("appearance.syncWithOs", true);

    const preferredThemeName = contextBridge.getSettingByKey<ThemeName>("appearance.preferredThemeName", "Web Dark");

    const preferredLightThemeName = contextBridge.getSettingByKey<ThemeName>(
        "appearance.preferredLightThemeName",
        "Web Light",
    );

    const preferredDarkThemeName = contextBridge.getSettingByKey<ThemeName>(
        "appearance.preferredDarkThemeName",
        "Web Dark",
    );

    if (syncWithOs) {
        return contextBridge.themeShouldUseDarkColors() ? preferredDarkThemeName : preferredLightThemeName;
    }

    return preferredThemeName;
};

export const getTheme = (contextBridge: ContextBridge): Theme => themeMap[getThemeName(contextBridge)];
