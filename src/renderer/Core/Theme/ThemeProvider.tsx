import { type Theme } from "@fluentui/react-theme";
import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext } from "./ThemeContext";
import { getFluentUiTheme } from "./getFluentUiTheme";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const initialShouldUseDarkColors = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const [fluentUiTheme, setFluentUiTheme] = useState<Theme>(getFluentUiTheme(initialShouldUseDarkColors));
    const [shouldUseDarkColors, setShouldUseDarkColors] = useState<boolean>(initialShouldUseDarkColors);

    useEffect(() => {
        const colorSchemeChangeListener = (event: MediaQueryListEvent) => {
            setShouldUseDarkColors(event.matches);
            setFluentUiTheme(getFluentUiTheme(event.matches));
        };

        const themeNameChangeListener = () => {
            setFluentUiTheme(getFluentUiTheme(window.matchMedia("(prefers-color-scheme: dark)").matches));
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
