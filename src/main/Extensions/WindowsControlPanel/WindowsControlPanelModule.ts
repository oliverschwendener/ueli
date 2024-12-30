import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { WindowsControlPanel } from "./WindowsControlPanel";
import { WindowsControlPanelActionHandler } from "./WindowsControlPanelActionHandler";
import { WindowsControlPanelItemRepository } from "./WindowsControlPanelItemRepository";

export class WindowsControlPanelModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        return {
            extension: new WindowsControlPanel(
                moduleRegistry.get("OperatingSystem"),
                moduleRegistry.get("Translator"),
                moduleRegistry.get("AssetPathResolver"),
                new WindowsControlPanelItemRepository(moduleRegistry.get("PowershellUtility")),
            ),
            actionHandlers: [new WindowsControlPanelActionHandler(moduleRegistry.get("PowershellUtility"))],
        };
    }
}
