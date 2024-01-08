import type { OperatingSystem } from "@common/OperatingSystem";
import { useEffect, useState, type CSSProperties } from "react";
import { useContextBridge } from "./Hooks";

const getMacOsCssProperties = (shouldUseDarkColors: boolean): CSSProperties => ({
    background: shouldUseDarkColors ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.75)",
});

const getWindowsCssProperties = (backgroundMaterial: string): CSSProperties => ({
    background: backgroundMaterial === "none" ? undefined : "transparent",
});

export const useAppCssProperties = () => {
    const { contextBridge } = useContextBridge();

    const operatingSystem = contextBridge.getOperatingSystem();

    const extendGlobalStyles = (cssProperties: CSSProperties) => ({ ...{ height: "100vh" }, ...cssProperties });

    const initalProperties: Record<OperatingSystem, CSSProperties> = {
        Linux: extendGlobalStyles({}),
        macOS: extendGlobalStyles(getMacOsCssProperties(contextBridge.themeShouldUseDarkColors())),
        Windows: extendGlobalStyles(
            getWindowsCssProperties(contextBridge.getSettingByKey("window.backgroundMaterial", "mica")),
        ),
    };

    const [appCssProperties, setAppCssProperties] = useState<CSSProperties>(initalProperties[operatingSystem]);

    useEffect(() => {
        contextBridge.onSettingUpdated<string>("window.backgroundMaterial", (value) =>
            setAppCssProperties({ ...appCssProperties, ...getWindowsCssProperties(value) }),
        );
    }, []);

    return { appCssProperties };
};
