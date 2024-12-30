import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { DeeplTranslatorExtension } from "./DeeplTranslatorExtension";

export class DeeplTranslatorModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        const net = moduleRegistry.get("Net");
        const assetPathResolver = moduleRegistry.get("AssetPathResolver");
        const settingsManager = moduleRegistry.get("SettingsManager");
        const translator = moduleRegistry.get("Translator");

        return {
            extension: new DeeplTranslatorExtension(net, assetPathResolver, settingsManager, translator),
        };
    }
}
