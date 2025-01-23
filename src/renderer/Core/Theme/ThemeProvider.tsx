import { useSetting } from "@Core/Hooks";
import { type Theme } from "@fluentui/react-theme";
import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext } from "./ThemeContext";
import { getFluentUiTheme } from "./getFluentUiTheme";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const { value: colorMode } = useSetting<string>({
        key: "appearance.colorMode",
        defaultValue: "system",
    });

    const initialShouldUseDarkColors =
        colorMode === "light"
            ? false
            : colorMode === "dark"
              ? true
              : window.matchMedia("(prefers-color-scheme: dark)").matches;

    const [fluentUiTheme, setFluentUiTheme] = useState<Theme>(getFluentUiTheme(initialShouldUseDarkColors));
    const [shouldUseDarkColors, setShouldUseDarkColors] = useState<boolean>(initialShouldUseDarkColors);

    useEffect(() => {
        const colorSchemeChangeListener = (event: MediaQueryListEvent) => {
            setShouldUseDarkColors(event.matches);
            setFluentUiTheme(getFluentUiTheme(event.matches));
        };

        const themeNameChangeListener = () => {
            const colorMode = window.ContextBridge.getSettingValue<string>("appearance.colorMode", "system");
            const shouldUseDark =
                colorMode === "dark"
                    ? true
                    : colorMode === "light"
                      ? false
                      : window.matchMedia("(prefers-color-scheme: dark)").matches;
            console.log(colorMode);
            console.log(shouldUseDark);
            setFluentUiTheme(getFluentUiTheme(shouldUseDark));
        };

        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", colorSchemeChangeListener);
        window.ContextBridge.ipcRenderer.on("settingUpdated[appearance.themeName]", themeNameChangeListener);
        window.ContextBridge.ipcRenderer.on("settingUpdated[appearance.colorMode]", themeNameChangeListener);

        return () => {
            window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", colorSchemeChangeListener);
            window.ContextBridge.ipcRenderer.off("settingUpdated[appearance.themeName]", themeNameChangeListener);
            window.ContextBridge.ipcRenderer.off("settingUpdated[appearance.colorMode]", themeNameChangeListener);
        };
    }, []);

    return <ThemeContext.Provider value={{ fluentUiTheme, shouldUseDarkColors }}>{children}</ThemeContext.Provider>;
};
