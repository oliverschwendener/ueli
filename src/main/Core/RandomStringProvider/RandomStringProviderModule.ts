import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { RandomStringProvider } from "./RandomStringProvider";

export class RandomStringProviderModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        dependencyRegistry.register("RandomStringProvider", new RandomStringProvider());
    }
}
