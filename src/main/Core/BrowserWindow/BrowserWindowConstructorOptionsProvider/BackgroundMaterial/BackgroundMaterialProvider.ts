import type { SettingsManager } from "@Core/SettingsManager";
import type { BrowserWindowConstructorOptions } from "electron";

type BackgroundMaterial = BrowserWindowConstructorOptions["backgroundMaterial"];

export class BackgroundMaterialProvider {
    public constructor(private readonly settingsManager: SettingsManager) {}

    public get(): BackgroundMaterial {
        const backgroundMaterial = this.settingsManager.getValue<string>("window.backgroundMaterial", "Mica");

        const backgroundMaterials: Record<string, BackgroundMaterial> = {
            Acrylic: "acrylic",
            Mica: "mica",
            None: "none",
            Tabbed: "tabbed",
        };

        return backgroundMaterials[backgroundMaterial] ?? "mica";
    }
}
