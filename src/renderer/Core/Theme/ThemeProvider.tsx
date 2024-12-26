import { webDarkTheme, webLightTheme, type Theme } from "@fluentui/react-theme";
import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext } from "./ThemeContext";
import { themeMap } from "./themes";

const defaultTheme = {
    dark: webDarkTheme,
    light: webLightTheme,
};

const getTheme = (shouldUseDarkColors: boolean) => {
    const themeName = window.ContextBridge.getSettingValue<string>("appearance.themeName", "Fluent UI Web");
    const { dark, light } = themeMap[themeName] ?? defaultTheme;
    return shouldUseDarkColors ? dark.theme : light.theme;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const initialShouldUseDarkColors = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const [theme, setTheme] = useState<Theme>(getTheme(initialShouldUseDarkColors));
    const [shouldUseDarkColors, setShouldUseDarkColors] = useState<boolean>(initialShouldUseDarkColors);

    useEffect(() => {
        const colorSchemeChangeListener = (event: MediaQueryListEvent) => {
            setShouldUseDarkColors(event.matches);
            setTheme(getTheme(event.matches));
        };

        const themeNameChangeListener = () => {
            setTheme(getTheme(window.matchMedia("(prefers-color-scheme: dark)").matches));
        };

        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", colorSchemeChangeListener);
        window.ContextBridge.ipcRenderer.on("settingUpdated[appearance.themeName]", themeNameChangeListener);

        return () => {
            window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", colorSchemeChangeListener);
            window.ContextBridge.ipcRenderer.off("settingUpdated[appearance.themeName]", themeNameChangeListener);
        };
    }, []);

    return <ThemeContext.Provider value={{ theme, shouldUseDarkColors }}>{children}</ThemeContext.Provider>;
};
