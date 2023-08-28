import type { ContextBridge } from "@common/ContextBridge";
import type { Theme } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { getTheme } from "../Theme";

export const useTheme = ({ contextBridge }: { contextBridge: ContextBridge }) => {
    const [theme, setTheme] = useState<Theme>(getTheme());

    useEffect(() => {
        contextBridge.onNativeThemeChanged(() => setTheme(getTheme()));
    }, []);

    return { theme, setTheme };
};
