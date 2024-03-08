import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { IniFileParser } from "./IniFileParser";

export class IniFileParserModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        dependencyRegistry.register("IniFileParser", new IniFileParser());
    }
}
