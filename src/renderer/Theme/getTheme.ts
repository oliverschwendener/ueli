import type { ContextBridge } from "@common/Core";
import type { Theme } from "@fluentui/react-components";
import { defaultTheme, themeMap } from "./themes";

export const getTheme = (contextBridge: ContextBridge): Theme => {
    const themeName = contextBridge.getSettingValue<string>("appearance.themeName", "Fluent UI Web");
    const { dark, light } = themeMap[themeName] ?? defaultTheme;
    return contextBridge.themeShouldUseDarkColors() ? dark.theme : light.theme;
};
