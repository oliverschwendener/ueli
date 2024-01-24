import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "./ExtensionBootstrapResult";

export interface ExtensionModule {
    bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult;
}
