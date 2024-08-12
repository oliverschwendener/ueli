import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { type LinuxDesktopEnvironment, SupportedLinuxDesktopEnvironments } from "@common/Core";

export class LinuxDesktopEnvironmentModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const operatingSystem = dependencyRegistry.get("OperatingSystem");

        if (operatingSystem !== "Linux") {
            dependencyRegistry.register("LinuxDesktopEnvironment", null);
            return;
        }

        const environmentVariableProvider = dependencyRegistry.get("EnvironmentVariableProvider");

        const currentDesktopEnvironment: LinuxDesktopEnvironment = environmentVariableProvider
            .get("XDG_CURRENT_DESKTOP")
            ?.split(":")
            .find((desktop: string): desktop is LinuxDesktopEnvironment =>
                SupportedLinuxDesktopEnvironments.includes(desktop as LinuxDesktopEnvironment),
            );

        if (!currentDesktopEnvironment) {
            dependencyRegistry.register("LinuxDesktopEnvironment", null);
        } else {
            dependencyRegistry.register("LinuxDesktopEnvironment", currentDesktopEnvironment);
        }
    }
}
