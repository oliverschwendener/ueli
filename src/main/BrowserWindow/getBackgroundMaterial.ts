import type { BrowserWindowConstructorOptions } from "electron";

type BackgroundMaterial = BrowserWindowConstructorOptions["backgroundMaterial"];

export const getBackgroundMaterial = (backgroundMaterial: BackgroundMaterial): BackgroundMaterial => {
    const backgroundMaterials: BackgroundMaterial[] = ["acrylic", "mica", "none", "tabbed"];

    return backgroundMaterials.includes(backgroundMaterial as BackgroundMaterial) ? backgroundMaterial : "mica";
};
