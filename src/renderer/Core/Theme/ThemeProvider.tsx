import { webDarkTheme, webLightTheme, type Theme } from "@fluentui/react-theme";
import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext } from "./ThemeContext";
import { themeMap } from "./themes";

const getFluentUiThemeTheme = (shouldUseDarkColors: boolean) => {
    const defaultTheme = {
        dark: webDarkTheme,
        light: webLightTheme,
    };

    const themeName = window.ContextBridge.getSettingValue<string>("appearance.themeName", "Fluent UI Web");

    const { dark, light } = themeMap[themeName] ?? defaultTheme;

    return shouldUseDarkColors ? dark.theme : light.theme;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const initialShouldUseDarkColors = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const [fluentUiTheme, setFluentUiTheme] = useState<Theme>(getFluentUiThemeTheme(initialShouldUseDarkColors));
    const [shouldUseDarkColors, setShouldUseDarkColors] = useState<boolean>(initialShouldUseDarkColors);

    useEffect(() => {
        const colorSchemeChangeListener = (event: MediaQueryListEvent) => {
            setShouldUseDarkColors(event.matches);
            setFluentUiTheme(getFluentUiThemeTheme(event.matches));
        };

        const themeNameChangeListener = () => {
            setFluentUiTheme(getFluentUiThemeTheme(window.matchMedia("(prefers-color-scheme: dark)").matches));
        };

        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", colorSchemeChangeListener);
        window.ContextBridge.ipcRenderer.on("settingUpdated[appearance.themeName]", themeNameChangeListener);

        return () => {
            window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", colorSchemeChangeListener);
            window.ContextBridge.ipcRenderer.off("settingUpdated[appearance.themeName]", themeNameChangeListener);
        };
    }, []);

    return <ThemeContext.Provider value={{ fluentUiTheme, shouldUseDarkColors }}>{children}</ThemeContext.Provider>;
};
