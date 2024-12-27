import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { NavigateToActionHandler } from "./ActionHandler";
import { AppIconFilePathResolver } from "./AppIconFilePathResolver";
import { BackgroundMaterialProvider } from "./BackgroundMaterial";
import { HtmlLoader } from "./HtmlLoader";
import { VibrancyProvider } from "./Vibrancy";

export class BrowserWindowModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const actionHandlerRegistry = dependencyRegistry.get("ActionHandlerRegistry");

        dependencyRegistry.register(
            "BrowserWindowBackgroundMaterialProvider",
            new BackgroundMaterialProvider(dependencyRegistry.get("SettingsManager")),
        );

        dependencyRegistry.register(
            "BrowserWindowVibrancyProvider",
            new VibrancyProvider(dependencyRegistry.get("SettingsManager")),
        );

        dependencyRegistry.register(
            "BrowserWindowHtmlLoader",
            new HtmlLoader(dependencyRegistry.get("App"), dependencyRegistry.get("EnvironmentVariableProvider")),
        );

        dependencyRegistry.register(
            "BrowserWindowAppIconFilePathResolver",
            new AppIconFilePathResolver(
                dependencyRegistry.get("NativeTheme"),
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("OperatingSystem"),
            ),
        );

        actionHandlerRegistry.register(new NavigateToActionHandler(dependencyRegistry.get("BrowserWindowNotifier")));
    }
}
