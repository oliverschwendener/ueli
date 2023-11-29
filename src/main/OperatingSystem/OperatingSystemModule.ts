import type { DependencyInjector } from "../DependencyInjector";
import type { OperatingSystem } from "./Contract";
import { getOperatingSystemFromPlatform } from "./getOperatingSystemFromPlatform";

export class OperatingSystemModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const operatingSystem = getOperatingSystemFromPlatform(dependencyInjector.getInstance<string>("Platform"));
        dependencyInjector.registerInstance<OperatingSystem>("OperatingSystem", operatingSystem);
    }
}
