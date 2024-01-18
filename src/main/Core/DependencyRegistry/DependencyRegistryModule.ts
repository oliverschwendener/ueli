import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry as DependencyRegistryInterface } from "./Contract";
import { DependencyRegistry } from "./DependencyRegistry";

export class DependencyRegistryModule {
    public static bootstrap(): DependencyRegistryInterface<Dependencies> {
        return new DependencyRegistry({});
    }
}
