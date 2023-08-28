import type { ContextBridge } from "@common/ContextBridge";
import type { Theme } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { getTheme } from "../Theme";

export const useTheme = (contextBridge: ContextBridge) => {
    const [theme, setTheme] = useState<Theme>(getTheme(contextBridge));

    useEffect(() => {
        contextBridge.onNativeThemeChanged(() => setTheme(getTheme(contextBridge)));
    }, []);

    return { theme, setTheme };
};
