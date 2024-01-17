import type { Dependencies, DependencyName } from "../Dependencies";

export interface DependencyRegistry {
    register<Name extends DependencyName>(name: Name, instance: Dependencies[Name]): void;
    get<Name extends DependencyName>(name: Name): Dependencies[Name];
}
