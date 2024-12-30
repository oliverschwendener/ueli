import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { XmlParser } from "./XmlParser";

export class XmlParserModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        moduleRegistry.register("XmlParser", new XmlParser());
    }
}
