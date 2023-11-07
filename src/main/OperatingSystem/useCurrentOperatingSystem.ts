import type { DependencyInjector } from "@common/DependencyInjector";
import type { OperatingSystem } from "@common/OperatingSystem";

export const useCurrentOperatingSystem = (dependencyInjector: DependencyInjector) => {
    const platform = dependencyInjector.getInstance<string>("Platform");

    const operatingSystemMap: Record<"darwin" | "win32", OperatingSystem> = {
        darwin: "macOS",
        win32: "Windows",
    };

    const operatingSystem: OperatingSystem | undefined = operatingSystemMap[platform];

    if (!operatingSystem) {
        throw new Error(`Unexpected platform: ${platform}`);
    }

    dependencyInjector.registerInstance<OperatingSystem>("OperatingSystem", operatingSystem);
};
