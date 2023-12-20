import type { OperatingSystem } from "@common/OperatingSystem";
import type { CSSProperties } from "react";

export const getGlobalCssProperties = (shouldUseDarkColors: boolean): Record<OperatingSystem, CSSProperties> => {
    const extendGlobalStyles = (cssProperties: CSSProperties) => ({ ...{ height: "100vh" }, ...cssProperties });

    return {
        Linux: extendGlobalStyles({}),
        macOS: extendGlobalStyles({
            background: shouldUseDarkColors ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.75)",
        }),
        Windows: extendGlobalStyles({}),
    };
};
