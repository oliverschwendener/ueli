import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { NativeThemeSource } from "./NativeThemeSource";
import { NativeThemeSourceManager } from "./NativeThemeSourceManager";

export class NativeThemeModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const nativeTheme = moduleRegistry.get("NativeTheme");
        const settingsManager = moduleRegistry.get("SettingsManager");
        const eventSubscriber = moduleRegistry.get("EventSubscriber");

        const nativeThemeSourceManager = new NativeThemeSourceManager(nativeTheme);

        const getNativeThemeSource = (): NativeThemeSource =>
            settingsManager.getValue<NativeThemeSource>("appearance.colorMode", "system");

        nativeThemeSourceManager.setSource(getNativeThemeSource());

        eventSubscriber.subscribe("settingUpdated[appearance.colorMode]", () => {
            nativeThemeSourceManager.setSource(getNativeThemeSource());
        });
    }
}
