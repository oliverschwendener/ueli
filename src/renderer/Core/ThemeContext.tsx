import { webDarkTheme, type Theme } from "@fluentui/react-components";
import { createContext } from "react";

type ThemeContextProps = {
    theme: Theme;
    shouldPreferDarkColors: boolean;
    setTheme: (theme: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextProps>({
    theme: webDarkTheme,
    shouldPreferDarkColors: false,
    setTheme: () => null,
});
