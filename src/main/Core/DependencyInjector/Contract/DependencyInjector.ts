import type { Dependencies, DependencyName } from "../Dependencies";

export interface DependencyInjector {
    registerInstance<Name extends DependencyName>(name: Name, instance: Dependencies[Name]): void;
    getInstance<Name extends DependencyName>(name: Name): Dependencies[Name];
}
