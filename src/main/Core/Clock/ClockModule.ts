import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { Clock } from "./Clock";

export class ClockModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        dependencyRegistry.register("Clock", new Clock());
    }
}
