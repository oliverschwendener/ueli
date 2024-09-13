import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { XmlParser } from "./XmlParser";

export class XmlParserModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        dependencyRegistry.register("XmlParser", new XmlParser());
    }
}
