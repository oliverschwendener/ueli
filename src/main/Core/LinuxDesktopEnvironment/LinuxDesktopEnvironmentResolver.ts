import type { LinuxDesktopEnvironment } from "@common/Core/LinuxDesktopEnvironment";
import type { EnvironmentVariableProvider } from "@Core/EnvironmentVariableProvider";
import type { LinuxDesktopEnvironmentResolver as LinuxDesktopEnvironmentResolverInterface } from "./Contract";

export class LinuxDesktopEnvironmentResolver implements LinuxDesktopEnvironmentResolverInterface {
    public constructor(private readonly environmentVariableProvider: EnvironmentVariableProvider) {}

    public resolve(): LinuxDesktopEnvironment | undefined {
        // Add implementation here
        throw new Error("Method not implemented.");
    }
}
