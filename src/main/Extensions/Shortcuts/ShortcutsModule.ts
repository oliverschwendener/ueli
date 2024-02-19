import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { ShortcutActionHandler } from "./ShortcutActionHandler";
import { Shortcuts } from "./Shortcuts";

export class ShortcutsModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        return {
            extension: new Shortcuts(
                dependencyRegistry.get("SettingsManager"),
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("UrlImageGenerator"),
                dependencyRegistry.get("FileImageGenerator"),
                dependencyRegistry.get("Logger"),
            ),
            actionHandlers: [new ShortcutActionHandler(dependencyRegistry.get("Shell"))],
        };
    }
}
