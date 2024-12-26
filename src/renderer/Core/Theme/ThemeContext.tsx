import { webDarkTheme, type Theme } from "@fluentui/react-components";
import { createContext } from "react";

type ThemeContextProps = {
    theme: Theme;
    shouldUseDarkColors: boolean;
};

export const ThemeContext = createContext<ThemeContextProps>({
    theme: webDarkTheme,
    shouldUseDarkColors: true,
});
