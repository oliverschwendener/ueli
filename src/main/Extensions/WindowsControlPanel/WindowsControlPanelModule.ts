import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { WindowsControlPanel } from "./WindowsControlPanel";
import { WindowsControlPanelActionHandler } from "./WindowsControlPanelActionHandler";
import { WindowsControlPanelItemRepository } from "./WindowsControlPanelItemRepository";

export class WindowsControlPanelModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        return {
            extension: new WindowsControlPanel(
                dependencyRegistry.get("OperatingSystem"),
                dependencyRegistry.get("Translator"),
                dependencyRegistry.get("AssetPathResolver"),
                new WindowsControlPanelItemRepository(dependencyRegistry.get("PowershellUtility")),
            ),
            actionHandlers: [new WindowsControlPanelActionHandler(dependencyRegistry.get("PowershellUtility"))],
        };
    }
}
