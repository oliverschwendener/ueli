import { Theme, webDarkTheme } from "@fluentui/react-components";
import { createContext } from "react";

type ThemeContextProps = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextProps>({
    theme: webDarkTheme,
    setTheme: () => null,
});
