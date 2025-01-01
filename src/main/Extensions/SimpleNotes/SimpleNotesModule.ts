import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { SimpleNotesExtension } from "./SimpleNotesExtension";

export class SimpleNotesModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        return {
            extension: new SimpleNotesExtension(
                moduleRegistry.get("AssetPathResolver"),
                moduleRegistry.get("Translator"),
            ),
        };
    }
}
