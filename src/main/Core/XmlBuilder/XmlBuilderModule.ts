import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { XmlBuilder } from "./XmlBuilder";

export class XmlBuilderModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        moduleRegistry.register("XmlBuilder", new XmlBuilder());
    }
}
