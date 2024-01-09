import type { BrowserWindowConstructorOptions } from "electron";

type BackgroundMaterial = BrowserWindowConstructorOptions["backgroundMaterial"];

export const getBackgroundMaterial = (backgroundMaterial: string): BackgroundMaterial => {
    const backgroundMaterials: Record<string, BackgroundMaterial> = {
        Acrylic: "acrylic",
        Mica: "mica",
        None: "none",
        Tabbed: "tabbed",
    };

    return backgroundMaterials[backgroundMaterial] ?? "mica";
};
