import type { DependencyInjector } from "../DependencyInjector";
import { Clock } from "./Clock";
import type { Clock as ClockInterface } from "./Contract";

export class ClockModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        dependencyInjector.registerInstance<ClockInterface>("Clock", new Clock());
    }
}
