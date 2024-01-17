import type { DependencyRegistry } from "../DependencyRegistry";
import { Clock } from "./Clock";

export class ClockModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        dependencyRegistry.register("Clock", new Clock());
    }
}
