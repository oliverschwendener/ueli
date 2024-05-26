import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { WindowsControlPanel } from "./WindowsControlPanel";
import { WindowsControlPanelActionHandler } from "./WindowsControlPanelActionHandler";
import { WindowsControlPanelItemsRepository } from "./WindowsControlPanelItemsRepository";

export class WindowsControlPanelModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const powershellUtility = dependencyRegistry.get("PowershellUtility");
        return {
            extension: new WindowsControlPanel(
                dependencyRegistry.get("OperatingSystem"),
                dependencyRegistry.get("Translator"),
                dependencyRegistry.get("AssetPathResolver"),
                new WindowsControlPanelItemsRepository(powershellUtility),
            ),
            actionHandlers: [new WindowsControlPanelActionHandler(powershellUtility)],
        };
    }
}
