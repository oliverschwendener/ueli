import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { BrowserWindowRegistry } from "./BrowserWindowRegistry";

export class BrowserWindowRegistryModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        dependencyRegistry.register("BrowserWindowRegistry", new BrowserWindowRegistry());
    }
}
