import { webDarkTheme } from "@fluentui/react-components";
import { createContext } from "react";
import type { ThemeContextProps } from "./ThemeContextProps";

export const ThemeContext = createContext<ThemeContextProps>({
    fluentUiTheme: webDarkTheme,
    shouldUseDarkColors: true,
});
