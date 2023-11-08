import type { DependencyInjector } from "@common/DependencyInjector";
import type { OperatingSystem } from "@common/OperatingSystem";
import { getOperatingSystemFromPlatform } from "./getOperatingSystemFromPlatform";

export class OperatingSystemModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const operatingSystem = getOperatingSystemFromPlatform(dependencyInjector.getInstance<string>("Platform"));
        dependencyInjector.registerInstance<OperatingSystem>("OperatingSystem", operatingSystem);
    }
}
