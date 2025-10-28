import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { NavigateToActionHandler } from "./ActionHandler";
import { BackgroundMaterialProvider } from "./BackgroundMaterial";
import { HtmlLoader } from "./HtmlLoader";
import { VibrancyProvider } from "./Vibrancy";

export class BrowserWindowModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const actionHandlerRegistry = moduleRegistry.get("ActionHandlerRegistry");
        const appIconFilePathResolver = moduleRegistry.get("AppIconFilePathResolver");

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

        // Bind the generic AppIcon resolver to the BrowserWindow-specific contract.
        // Rationale: keep BrowserWindow dependent on its minimal adapter interface
        // for decoupling and easy testing/mocking. The implementation can change
        // without touching BrowserWindow code.
        moduleRegistry.register("BrowserWindowAppIconFilePathResolver", appIconFilePathResolver);

        actionHandlerRegistry.register(new NavigateToActionHandler(moduleRegistry.get("BrowserWindowNotifier")));
    }
}
