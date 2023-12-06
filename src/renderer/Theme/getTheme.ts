import type { ContextBridge } from "@common/ContextBridge";
import type { Theme } from "@fluentui/react-components";
import { defaultTheme, themeMap } from "./themes";

export const getTheme = (contextBridge: ContextBridge): Theme => {
    const themeName = contextBridge.getSettingByKey<string>("appearance.themeName", "Ueli");
    const { dark, light } = themeMap[themeName] ?? defaultTheme;
    return contextBridge.themeShouldUseDarkColors() ? dark.theme : light.theme;
};
