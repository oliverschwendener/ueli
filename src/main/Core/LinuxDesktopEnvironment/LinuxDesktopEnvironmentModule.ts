import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { LinuxDesktopEnvironmentResolver } from "./LinuxDesktopEnvironmentResolver";

export class LinuxDesktopEnvironmentModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry): void {
        moduleRegistry.register(
            "LinuxDesktopEnvironmentResolver",
            new LinuxDesktopEnvironmentResolver(moduleRegistry.get("EnvironmentVariableProvider")),
        );
    }
}
