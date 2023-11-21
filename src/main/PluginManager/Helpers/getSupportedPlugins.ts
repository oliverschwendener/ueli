import type { OperatingSystem } from "@common/OperatingSystem";
import type { UeliPlugin } from "@common/UeliPlugin";

export const getSupportedPlugins = (plugins: UeliPlugin[], currentOperatingSystem: OperatingSystem) =>
    plugins.filter((plugin) => plugin.supportedOperatingSystems.includes(currentOperatingSystem));
