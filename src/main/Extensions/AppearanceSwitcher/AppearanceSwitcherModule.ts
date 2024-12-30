import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { AppearanceSwitcher } from "./AppearanceSwitcher";
import { CustomActionHandler } from "./CustomActionHandler";

export class AppearanceSwitcherModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        return {
            extension: new AppearanceSwitcher(
                moduleRegistry.get("OperatingSystem"),
                moduleRegistry.get("AssetPathResolver"),
                moduleRegistry.get("Translator"),
            ),
            actionHandlers: [
                new CustomActionHandler(
                    moduleRegistry.get("OperatingSystem"),
                    moduleRegistry.get("PowershellUtility"),
                    moduleRegistry.get("AppleScriptUtility"),
                    moduleRegistry.get("NativeTheme"),
                ),
            ],
        };
    }
}
