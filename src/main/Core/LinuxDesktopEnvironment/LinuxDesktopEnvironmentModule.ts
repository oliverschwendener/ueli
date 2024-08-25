import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { LinuxDesktopEnvironmentResolver } from "./LinuxDesktopEnvironmentResolver";

export class LinuxDesktopEnvironmentModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): void {
        dependencyRegistry.register(
            "LinuxDesktopEnvironmentResolver",
            new LinuxDesktopEnvironmentResolver(dependencyRegistry.get("EnvironmentVariableProvider")),
        );
    }
}
