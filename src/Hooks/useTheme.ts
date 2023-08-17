import { Theme } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { getTheme } from "../Theme";

export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>(getTheme());

    useEffect(() => {
        window.ContextBridge.onNativeThemeChanged(() => setTheme(getTheme()));
    }, []);

    return { theme, setTheme };
};
