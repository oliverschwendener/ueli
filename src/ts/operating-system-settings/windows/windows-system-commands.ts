import { WindowsSettingsHelpers } from "../../helpers/windows-settings-helpers";
import { OperatingSystemCommand } from "../operating-system-command";
import { shutDownIcon, restartIcon, logOutIcon, lockIcon } from "../operating-system-command-icons";

export const windowsSystemCommands: OperatingSystemCommand[] = [
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}shutdown -s -t 0`,
        icon: shutDownIcon,
        name: "Shutdown",
        tags: ["power", "off"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}shutdown -r -t 0`,
        icon: restartIcon,
        name: "Restart",
        tags: ["reboot"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}shutdown /l`,
        icon: logOutIcon,
        name: "Sign out",
        tags: ["out", "off", "sign", "user", "log"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}rundll32 user32.dll,LockWorkStation`,
        icon: lockIcon,
        name: "Lock computer",
        tags: [],
    },
];
