import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { RowlyTextEditorExtension } from "./RowlyTextEditorExtension";
import { RowlyTextProcessor } from "./RowlyTextProcessor";

export class RowlyTextEditorModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        const assetPathResolver = moduleRegistry.get("AssetPathResolver");
        const translator = moduleRegistry.get("Translator");
        return {
            extension: new RowlyTextEditorExtension(assetPathResolver, translator, new RowlyTextProcessor()),
        };
    }
}
