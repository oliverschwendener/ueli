import type { Theme } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { getTheme } from "../Theme";
import { useContextBridge } from "./useContextBridge";

export const useTheme = () => {
    const { contextBridge } = useContextBridge();

    const [theme, setTheme] = useState<Theme>(getTheme(contextBridge));

    useEffect(() => {
        const eventListener = () => setTheme(getTheme(contextBridge));

        contextBridge.ipcRenderer.on("nativeThemeChanged", eventListener);

        return () => {
            contextBridge.ipcRenderer.off("nativeThemeChanged", eventListener);
        };
    }, []);

    return { theme, setTheme };
};
