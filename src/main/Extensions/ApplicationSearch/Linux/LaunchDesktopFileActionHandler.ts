import type { ActionHandler } from "@Core/ActionHandler";
import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { EnvironmentVariableProvider } from "@Core/EnvironmentVariableProvider";
import type { SearchResultItemAction } from "@common/Core";

/**
 * All supported Linux desktop environments.
 */
type LinuxDesktopEnvironment =
    | "GNOME"
    | "GNOME-Classic"
    | "GNOME-Flashback"
    | "Cinnamon"
    | "MATE"
    | "Pantheon"
    | "KDE"
    | "LXDE"
    | "LXQt"
    | "XFCE"
    | "DDE";

/**
 * Action handler for launching a `.desktop` file.
 */
export class LaunchDesktopFileActionHandler implements ActionHandler {
    public readonly id = "LaunchDesktopFile";

    public constructor(
        private readonly commandlineUtility: CommandlineUtility,
        private readonly environmentVariableProvider: EnvironmentVariableProvider,
    ) {}

    /**
     * Launches the given `.desktop` file with the desktop environment's respective command.
     * Expects the given action's argument to be a valid desktop file
     * Throws an error if the file could not be launched or desktop environment isn't supported.
     */
    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        const desktopLaunchCommands: Record<LinuxDesktopEnvironment, string> = {
            Cinnamon: "gio launch",
            GNOME: "gio launch",
            "GNOME-Classic": "gio launch",
            "GNOME-Flashback": "gio launch",
            MATE: "gio launch",
            Pantheon: "",
            KDE: "kde-open",
            LXDE: "",
            LXQt: "",
            XFCE: "exo-open",
            DDE: "dde-open",
        };

        const desktops = this.environmentVariableProvider
            .get("XDG_CURRENT_DESKTOP")
            .split(":") as LinuxDesktopEnvironment[];

        let command: string;

        for (const desktop of desktops) {
            command = desktopLaunchCommands[desktop];
            if (command) {
                break;
            }
        }

        if (!command) {
            throw new Error(`Unable to launch ${action.argument}. Unsupported desktop environment: ${desktops}`);
        }

        await this.commandlineUtility.executeCommand(`${command} ${action.argument}`, true);
    }
}
