import type { EnvironmentVariableProvider } from "@Core/EnvironmentVariableProvider";
import type { LinuxDesktopEnvironmentResolver as LinuxDesktopEnvironmentResolverInterface } from "./Contract";

export class LinuxDesktopEnvironmentResolver implements LinuxDesktopEnvironmentResolverInterface {
    public constructor(private readonly environmentVariableProvider: EnvironmentVariableProvider) {}

    public resolve(): string | undefined {
        const map: Record<string, string> = {
            "ubuntu:GNOME": "GNOME",
            KDE: "KDE",
        };

        return map[this.environmentVariableProvider.get("XDG_CURRENT_DESKTOP")];
    }
}
