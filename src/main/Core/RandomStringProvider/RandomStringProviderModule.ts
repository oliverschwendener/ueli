import { DependencyRegistry } from "..";
import { RandomStringProvider } from "./RandomStringProvider";

export class RandomStringProviderModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        dependencyRegistry.register("RandomStringProvider", new RandomStringProvider());
    }
}
