import type { DependencyInjector } from "..";
import { ExtensionRegistry } from "./ExtensionRegistry";

export class ExtensionRegsitryModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        dependencyInjector.registerInstance("ExtensionRegistry", new ExtensionRegistry());
    }
}
