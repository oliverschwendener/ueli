import type { ContextBridge, OperatingSystem } from "@common/Core";
import { useEffect, useState, type CSSProperties } from "react";

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
        Tabbed: "transparent",
        Acrylic: contextBridge.themeShouldUseDarkColors()
            ? `rgba(0,0,0,${acrylicOpacity})`
            : `rgba(255,255,255,${acrylicOpacity})`,
    };

    return { background: map[backgroundMaterial] };
};

export const useAppCssProperties = () => {
    const operatingSystem = window.ContextBridge.getOperatingSystem();

    const extendGlobalStyles = (cssProperties: CSSProperties) => ({ height: "100vh", ...cssProperties });

    const initialProperties: Record<OperatingSystem, CSSProperties> = {
        Linux: extendGlobalStyles({}),
        macOS: extendGlobalStyles(getMacOsCssProperties(window.ContextBridge)),
        Windows: extendGlobalStyles(getWindowsCssProperties(window.ContextBridge)),
    };

    const [appCssProperties, setAppCssProperties] = useState<CSSProperties>(initialProperties[operatingSystem]);

    useEffect(() => {
        const eventHandlers: Record<OperatingSystem, () => void> = {
            Linux: () => null,
            macOS: () => setAppCssProperties(extendGlobalStyles(getMacOsCssProperties(window.ContextBridge))),
            Windows: () => setAppCssProperties(extendGlobalStyles(getWindowsCssProperties(window.ContextBridge))),
        };

        const channels: Record<OperatingSystem, string[]> = {
            Linux: [],
            macOS: ["settingUpdated[window.vibrancy]"],
            Windows: [
                "nativeThemeChanged",
                "settingUpdated[window.backgroundMaterial]",
                "settingUpdated[window.acrylicOpacity]",
            ],
        };

        const registerEventListeners = () => {
            for (const channel of channels[operatingSystem]) {
                window.ContextBridge.ipcRenderer.on(channel, eventHandlers[operatingSystem]);
            }
        };

        const unregisterEventListeners = () => {
            for (const channel of channels[operatingSystem]) {
                window.ContextBridge.ipcRenderer.off(channel, eventHandlers[operatingSystem]);
            }
        };

        registerEventListeners();

        return () => {
            unregisterEventListeners();
        };
    }, []);

    return { appCssProperties };
};
