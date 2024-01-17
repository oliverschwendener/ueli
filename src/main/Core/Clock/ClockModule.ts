import type { DependencyInjector } from "../DependencyInjector";
import { Clock } from "./Clock";

export class ClockModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        dependencyInjector.registerInstance("Clock", new Clock());
    }
}
