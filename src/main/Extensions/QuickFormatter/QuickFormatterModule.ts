import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { QuickFormatter } from "./QuickFormatter";
import { QuickFormatterExtension } from "./QuickFormatterExtension";

export class QuickFormatterModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        return {
            extension: new QuickFormatterExtension(
                moduleRegistry.get("AssetPathResolver"),
                moduleRegistry.get("SettingsManager"),
                new QuickFormatter(moduleRegistry.get("XmlBuilder"), moduleRegistry.get("XmlParser")),
            ),
        };
    }
}
