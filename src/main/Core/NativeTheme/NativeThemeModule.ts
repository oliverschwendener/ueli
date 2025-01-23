import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { NativeThemeSource } from "./NativeThemeSource";

export class NativeThemeModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const nativeTheme = moduleRegistry.get("NativeTheme");
        const settingsManager = moduleRegistry.get("SettingsManager");
        const eventSubscriber = moduleRegistry.get("EventSubscriber");

        const getNativeThemeSource = (): NativeThemeSource =>
            settingsManager.getValue<NativeThemeSource>("appearance.themeSource", "system");

        nativeTheme.themeSource = getNativeThemeSource();

        eventSubscriber.subscribe("settingUpdated[appearance.themeSource]", () => {
            nativeTheme.themeSource = getNativeThemeSource();
        });
    }
}
