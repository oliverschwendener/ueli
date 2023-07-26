import { Theme } from "@fluentui/react-components";
import { createContext } from "react";
import { getThemeName, themeMap } from "./Theme";

type ThemeContextProps = {
    theme: Theme;
};

export const ThemeContext = createContext<ThemeContextProps>({
    theme: themeMap[getThemeName()],
});
