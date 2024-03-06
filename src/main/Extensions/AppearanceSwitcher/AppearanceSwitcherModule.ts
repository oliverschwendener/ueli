import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { AppearanceSwitcher } from "./AppearanceSwitcher";
import { CustomActionHandler } from "./CustomActionHandler";

export class AppearanceSwitcherModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        return {
            extension: new AppearanceSwitcher(
                dependencyRegistry.get("OperatingSystem"),
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("Translator"),
            ),
            actionHandlers: [
                new CustomActionHandler(
                    dependencyRegistry.get("OperatingSystem"),
                    dependencyRegistry.get("CommandlineUtility"),
                    dependencyRegistry.get("AppleScriptUtility"),
                    dependencyRegistry.get("NativeTheme"),
                ),
            ],
        };
    }
}
