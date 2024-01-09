import type { OperatingSystem } from "@common/OperatingSystem";
import { useEffect, useState, type CSSProperties } from "react";
import { useContextBridge } from "./Hooks";

const getMacOsCssProperties = (vibrancy: string): CSSProperties =>
    vibrancy === "None" ? {} : { background: "transparent" };

const getWindowsCssProperties = (backgroundMaterial: string): CSSProperties => ({
    background: backgroundMaterial === "none" ? undefined : "transparent",
});

export const useAppCssProperties = () => {
    const { contextBridge } = useContextBridge();

    const operatingSystem = contextBridge.getOperatingSystem();

    const extendGlobalStyles = (cssProperties: CSSProperties) => ({ ...{ height: "100vh" }, ...cssProperties });

    const initalProperties: Record<OperatingSystem, CSSProperties> = {
        Linux: extendGlobalStyles({}),
        macOS: extendGlobalStyles(getMacOsCssProperties(contextBridge.getSettingByKey("window.vibrancy", "None"))),
        Windows: extendGlobalStyles(
            getWindowsCssProperties(contextBridge.getSettingByKey("window.backgroundMaterial", "mica")),
        ),
    };

    const [appCssProperties, setAppCssProperties] = useState<CSSProperties>(initalProperties[operatingSystem]);

    useEffect(() => {
        if (operatingSystem === "Windows") {
            contextBridge.onSettingUpdated<string>("window.backgroundMaterial", (value) =>
                setAppCssProperties(extendGlobalStyles(getWindowsCssProperties(value))),
            );
        }

        if (operatingSystem === "macOS") {
            contextBridge.onSettingUpdated<string>("window.vibrancy", (value) =>
                setAppCssProperties(extendGlobalStyles(getMacOsCssProperties(value))),
            );
        }
    }, []);

    return { appCssProperties };
};
