import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { BackgroundMaterialProvider } from "./BackgroundMaterial";
import { VibrancyProvider } from "./Vibrancy";

export class BrowserWindowModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        dependencyRegistry.register(
            "BrowserWindowBackgroundMaterialProvider",
            new BackgroundMaterialProvider(dependencyRegistry.get("SettingsManager")),
        );

        dependencyRegistry.register(
            "BrowserWindowVibrancyProvider",
            new VibrancyProvider(dependencyRegistry.get("SettingsManager")),
        );
    }
}
