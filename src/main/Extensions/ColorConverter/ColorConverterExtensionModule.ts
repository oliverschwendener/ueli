import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { ColorConverterExtension } from "./ColorConverterExtension";
import { QixColorConverter } from "./QixColorConverter";
import { SvgColorPreviewGenerator } from "./SvgColorPreviewGenerator";

export class ColorConverterExtensionModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        return {
            extension: new ColorConverterExtension(
                moduleRegistry.get("AssetPathResolver"),
                moduleRegistry.get("SettingsManager"),
                moduleRegistry.get("Translator"),
                new QixColorConverter(),
                new SvgColorPreviewGenerator(),
            ),
        };
    }
}
