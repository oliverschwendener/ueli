import type { ContextBridge, OperatingSystem } from "@common/Core";
import { useEffect, useState, type CSSProperties } from "react";
import { useContextBridge } from "./Hooks";

const getMacOsCssProperties = (contextBridge: ContextBridge): CSSProperties => {
    return contextBridge.getSettingValue<string>("window.vibrancy", "None") === "None"
        ? {}
        : { background: "transparent" };
};

const getWindowsCssProperties = (contextBridge: ContextBridge): CSSProperties => {
    const backgroundMaterial = contextBridge.getSettingValue<string>("window.backgroundMaterial", "Mica");
    const acrylicOpacity = contextBridge.getSettingValue("window.acrylicOpacity", 0.6);

    const map: Record<string, CSSProperties["background"]> = {
        None: undefined,
        Mica: "transparent",
        Acrylic: contextBridge.themeShouldUseDarkColors()
            ? `rgba(0,0,0,${acrylicOpacity})`
            : `rgba(255,255,255,${acrylicOpacity})`,
    };

    return { background: map[backgroundMaterial] };
};

export const useAppCssProperties = () => {
    const { contextBridge } = useContextBridge();

    const operatingSystem = contextBridge.getOperatingSystem();

    const extendGlobalStyles = (cssProperties: CSSProperties) => {
        return { ...{ height: "100vh" }, ...cssProperties };
    };

    const initialProperties: Record<OperatingSystem, CSSProperties> = {
        Linux: extendGlobalStyles({}),
        macOS: extendGlobalStyles(getMacOsCssProperties(contextBridge)),
        Windows: extendGlobalStyles(getWindowsCssProperties(contextBridge)),
    };

    const [appCssProperties, setAppCssProperties] = useState<CSSProperties>(initialProperties[operatingSystem]);

    useEffect(() => {
        if (operatingSystem === "Windows") {
            contextBridge.ipcRenderer.on("nativeThemeChanged", () => {
                setAppCssProperties(extendGlobalStyles(getWindowsCssProperties(contextBridge)));
            });

            contextBridge.ipcRenderer.on("settingUpdated[window.backgroundMaterial]", () => {
                setAppCssProperties(extendGlobalStyles(getWindowsCssProperties(contextBridge)));
            });

            contextBridge.ipcRenderer.on("settingUpdated[window.acrylicOpacity]", () => {
                setAppCssProperties(extendGlobalStyles(getWindowsCssProperties(contextBridge)));
            });
        }

        if (operatingSystem === "macOS") {
            contextBridge.ipcRenderer.on("nativeThemeChanged", () => {
                setAppCssProperties(extendGlobalStyles(getMacOsCssProperties(contextBridge)));
            });

            contextBridge.ipcRenderer.on("settingUpdated[window.vibrancy]", () => {
                setAppCssProperties(extendGlobalStyles(getMacOsCssProperties(contextBridge)));
            });
        }
    }, []);

    return { appCssProperties };
};
