import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { IniFileParser } from "./IniFileParser";

export class IniFileParserModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        moduleRegistry.register("IniFileParser", new IniFileParser());
    }
}
