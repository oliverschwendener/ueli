import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { RowlandTextEditorExtension } from "./RowlandTextEditorExtension";
import { RowlandTextProcessor } from "./RowlandTextProcessor";

export class RowlandTextEditorModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        const assetPathResolver = moduleRegistry.get("AssetPathResolver");
        const translator = moduleRegistry.get("Translator");
        return {
            extension: new RowlandTextEditorExtension(assetPathResolver, translator, new RowlandTextProcessor()),
        };
    }
}
