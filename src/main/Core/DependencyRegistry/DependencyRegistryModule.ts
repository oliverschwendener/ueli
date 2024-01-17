import { DependencyRegistry as DependencyRegistryInterface } from "./Contract";
import { DependencyRegistry } from "./DependencyRegistry";

export class DependencyRegistryModule {
    public static bootstrap(): DependencyRegistryInterface {
        return new DependencyRegistry();
    }
}
