import type { OperatingSystem } from "@common/OperatingSystem";
import type { DependencyInjector } from "../DependencyInjector";
import { getOperatingSystemFromPlatform } from "./getOperatingSystemFromPlatform";

export class OperatingSystemModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const operatingSystem = getOperatingSystemFromPlatform(dependencyInjector.getInstance<string>("Platform"));
        dependencyInjector.registerInstance<OperatingSystem>("OperatingSystem", operatingSystem);
    }
}
