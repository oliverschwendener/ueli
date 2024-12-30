import type { OperatingSystem } from "@common/Core";
import { type CSSProperties } from "react";

const getMacOsCssProperties = ({ vibrancy }: { vibrancy: string }): CSSProperties => {
    return vibrancy === "None" ? {} : { background: "transparent" };
};

const getWindowsCssProperties = ({
    shouldUseDarkColors,
    backgroundMaterial,
    acrylicOpacity,
}: {
    shouldUseDarkColors: boolean;
    backgroundMaterial: string;
    acrylicOpacity: number;
}): CSSProperties => {
    const map: Record<string, CSSProperties["background"]> = {
        None: undefined,
        Mica: "transparent",
        Tabbed: "transparent",
        Acrylic: shouldUseDarkColors ? `rgba(0,0,0,${acrylicOpacity})` : `rgba(255,255,255,${acrylicOpacity})`,
    };

    return { background: map[backgroundMaterial] };
};

type UseAppCssPropertiesProps = {
    shouldUseDarkColors: boolean;
    backgroundMaterial: string;
    acrylicOpacity: number;
    vibrancy: string;
};

export const getAppCssProperties = ({
    shouldUseDarkColors,
    acrylicOpacity,
    backgroundMaterial,
    vibrancy,
}: UseAppCssPropertiesProps) => {
    const operatingSystem = window.ContextBridge.getOperatingSystem();

    const extendGlobalStyles = (cssProperties: CSSProperties) => ({ height: "100vh", ...cssProperties });

    const map: Record<OperatingSystem, CSSProperties> = {
        Linux: extendGlobalStyles({}),
        macOS: extendGlobalStyles(getMacOsCssProperties({ vibrancy })),
        Windows: extendGlobalStyles(
            getWindowsCssProperties({ shouldUseDarkColors, acrylicOpacity, backgroundMaterial }),
        ),
    };

    return { appCssProperties: map[operatingSystem] };
};
