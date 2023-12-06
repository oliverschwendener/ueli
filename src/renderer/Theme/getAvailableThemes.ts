import { themeMap } from "./themes";

export const getAvailableThemes = () => {
    const availableThemes: { name: string; accentColors: { dark: string; light: string } }[] = [];

    for (const themeName of Object.keys(themeMap)) {
        availableThemes.push({
            name: themeName,
            accentColors: {
                dark: themeMap[themeName].dark.accentColor,
                light: themeMap[themeName].light.accentColor,
            },
        });
    }

    return availableThemes;
};
