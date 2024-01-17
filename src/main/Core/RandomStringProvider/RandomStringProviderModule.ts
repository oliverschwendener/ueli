import { DependencyInjector } from "..";
import { RandomStringProvider } from "./RandomStringProvider";

export class RandomStringProviderModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        dependencyInjector.registerInstance("RandomStringProvider", new RandomStringProvider());
    }
}
