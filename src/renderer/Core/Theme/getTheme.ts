import type { ContextBridge } from "@common/Core";
import { BrandVariants, createDarkTheme, createLightTheme, type Theme } from "@fluentui/react-components";
import { darkTheme, lightTheme } from "./defaultValues";
import { defaultTheme, themeMap } from "./themes";

const createCustomTheme = (contextBridge: ContextBridge): Theme => {
    const customDarkThemeVariants = contextBridge.getSettingValue<BrandVariants>(
        "appearance.customDarkThemeVariants",
        darkTheme,
    );

    const customLightThemeVariants = contextBridge.getSettingValue<BrandVariants>(
        "appearance.customDarkThemeVariants",
        lightTheme,
    );

    return contextBridge.themeShouldUseDarkColors()
        ? createDarkTheme(customDarkThemeVariants)
        : createLightTheme(customLightThemeVariants);
};

export const getTheme = (contextBridge: ContextBridge): Theme => {
    const themeName = contextBridge.getSettingValue<string>("appearance.themeName", "Fluent UI Web");

    if (themeName === "Custom") {
        return createCustomTheme(contextBridge);
    }

    const { dark, light } = themeMap[themeName] ?? defaultTheme;
    return contextBridge.themeShouldUseDarkColors() ? dark.theme : light.theme;
};
