import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { NavigateToActionHandler } from "./ActionHandler";
import { BackgroundMaterialProvider } from "./BackgroundMaterial";
import { HtmlLoader } from "./HtmlLoader";
import { VibrancyProvider } from "./Vibrancy";

export class BrowserWindowModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const actionHandlerRegistry = moduleRegistry.get("ActionHandlerRegistry");

        moduleRegistry.register(
            "BrowserWindowBackgroundMaterialProvider",
            new BackgroundMaterialProvider(moduleRegistry.get("SettingsManager")),
        );

        moduleRegistry.register(
            "BrowserWindowVibrancyProvider",
            new VibrancyProvider(moduleRegistry.get("SettingsManager")),
        );

        moduleRegistry.register(
            "BrowserWindowHtmlLoader",
            new HtmlLoader(moduleRegistry.get("EnvironmentVariableProvider")),
        );

        actionHandlerRegistry.register(new NavigateToActionHandler(moduleRegistry.get("BrowserWindowNotifier")));
    }
}
