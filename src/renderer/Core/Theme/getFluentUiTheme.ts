import { webDarkTheme, webLightTheme } from "@fluentui/react-components";
import { themeMap } from "./themes";

export const getFluentUiTheme = (shouldUseDarkColors: boolean) => {
    const defaultTheme = {
        dark: { theme: webDarkTheme },
        light: { theme: webLightTheme },
    };

    const themeName = window.ContextBridge.getSettingValue<string>("appearance.themeName", "Fluent UI Web");

    const { dark, light } = Object.keys(themeMap).includes(themeName) ? themeMap[themeName] : defaultTheme;

    return shouldUseDarkColors ? dark.theme : light.theme;
};
