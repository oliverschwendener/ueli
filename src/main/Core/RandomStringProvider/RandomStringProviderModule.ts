import { DependencyInjector } from "..";
import { RandomStringProvider as RandomStringProviderInterface } from "./Contract";
import { RandomStringProvider } from "./RandomStringProvider";

export class RandomStringProviderModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        dependencyInjector.registerInstance<RandomStringProviderInterface>(
            "RandomStringProvider",
            new RandomStringProvider(),
        );
    }
}
