import type { EnvironmentVariableProvider } from "@Core/EnvironmentVariableProvider";
import type {
    LinuxDesktopEnvironment,
    LinuxDesktopEnvironmentResolver as LinuxDesktopEnvironmentResolverInterface,
} from "./Contract";

export class LinuxDesktopEnvironmentResolver implements LinuxDesktopEnvironmentResolverInterface {
    public constructor(private readonly environmentVariableProvider: EnvironmentVariableProvider) {}

    public resolve(): LinuxDesktopEnvironment | undefined {
        const map: Record<string, LinuxDesktopEnvironment> = {
            GNOME: "GNOME",
            "GNOME-Classic": "GNOME",
            "GNOME-Flashback": "GNOME",
            KDE: "KDE",
            COSMIC: "COSMIC",
            LXDE: "LXDE",
            LXQt: "LXQt",
            MATE: "MATE",
            Unity: "Unity",
            XFCE: "XFCE",
            Cinnamon: "Cinnamon",
            "X-Cinnamon": "Cinnamon",
            Pantheon: "Pantheon",
            DDE: "DDE",
        };

        const originalXdgCurrentDesktop = this.environmentVariableProvider.get("ORIGINAL_XDG_CURRENT_DESKTOP");

        if (!originalXdgCurrentDesktop) {
            return undefined;
        }

        for (const environment of originalXdgCurrentDesktop.split(":")) {
            if (map[environment]) {
                return map[environment];
            }
        }

        return undefined;
    }
}
