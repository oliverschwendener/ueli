import type { ContextBridge } from "@common/ContextBridge";
import type { Theme } from "@fluentui/react-components";
import { themeMap } from "./themes";

export const getTheme = (contextBridge: ContextBridge): Theme => {
    const themeName = contextBridge.getSettingByKey<string>("appearance.preferredThemeName", "Ueli");
    return contextBridge.themeShouldUseDarkColors() ? themeMap[themeName].dark : themeMap[themeName].light;
};
