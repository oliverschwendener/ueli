import { WindowsSettingsHelpers } from "../../helpers/windows-settings-helpers";
import { OperatingSystemCommand } from "../operating-system-command";
import { shutDownIcon, restartIcon, logOutIcon, lockIcon } from "../operating-system-command-icons";

export const windowsSystemCommands: OperatingSystemCommand[] = [
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}shutdown -s -t 0`,
        icon: shutDownIcon,
        name: "Shutdown",
        tags: ["poweroff"],
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
        tags: ["signout"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}rundll32 user32.dll,LockWorkStation`,
        icon: lockIcon,
        name: "Lock computer",
        tags: ["lock"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}shell:RecycleBinFolder`,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 40 40" version="1.1">
        <g id="surface1">
        <path style=" fill:#DFF0FE;" d="M 7.5 34.5 L 7.5 34 L 3.496094 5.929688 L 3.496094 5.5 L 36.5 5.5 L 36.5 6 L 32.503906 33.929688 L 32.503906 34.5 Z "></path>
        <path style=" fill:#4788C7;" d="M 35.988281 6 L 32.011719 33.859375 L 32 33.929688 L 32 34 L 8 34 L 8 33.929688 L 7.988281 33.859375 L 4.011719 6 L 35.988281 6 M 37 5 L 3 5 L 3 6 L 7 34 L 7 35 L 33 35 L 33 34 L 37 6 Z "></path>
        <path style=" fill:#B6DCFE;" d="M 3 5.5 C 2.726563 5.5 2.5 5.277344 2.5 5 L 2.5 2 C 2.5 1.722656 2.726563 1.5 3 1.5 L 37 1.5 C 37.273438 1.5 37.5 1.722656 37.5 2 L 37.5 5 C 37.5 5.277344 37.273438 5.5 37 5.5 Z "></path>
        <path style=" fill:#4788C7;" d="M 37 2 L 37 5 L 3 5 L 3 2 L 37 2 M 37 1 L 3 1 C 2.449219 1 2 1.449219 2 2 L 2 5 C 2 5.550781 2.449219 6 3 6 L 37 6 C 37.550781 6 38 5.550781 38 5 L 38 2 C 38 1.449219 37.550781 1 37 1 Z "></path>
        <path style=" fill:#B6DCFE;" d="M 10 38.5 C 8.621094 38.5 7.5 37.378906 7.5 36 L 7.5 34.5 L 32.5 34.5 L 32.5 36 C 32.5 37.378906 31.378906 38.5 30 38.5 Z "></path>
        <path style=" fill:#4788C7;" d="M 32 35 L 32 36 C 32 37.101563 31.101563 38 30 38 L 10 38 C 8.898438 38 8 37.101563 8 36 L 8 35 L 32 35 M 33 34 L 7 34 L 7 36 C 7 37.65625 8.34375 39 10 39 L 30 39 C 31.65625 39 33 37.65625 33 36 Z "></path>
        <path style=" fill:#4788C7;" d="M 27.261719 21.773438 L 26.136719 19.871094 L 25.429688 21.417969 L 23.726563 21.296875 L 24.851563 23.199219 L 21.621094 23.199219 L 20.269531 24.601563 L 21.621094 26 L 24.859375 26 C 26.027344 26 26.972656 25.503906 27.453125 24.636719 C 27.933594 23.773438 27.855469 22.722656 27.261719 21.773438 Z "></path>
        <path style=" fill:#4788C7;" d="M 24.589844 17.128906 L 22.453125 13.503906 C 21.859375 12.546875 20.976563 12 20.035156 12 C 19.09375 12 18.210938 12.546875 17.597656 13.53125 L 16.261719 15.785156 L 17.921875 15.753906 L 18.667969 17.214844 L 19.988281 14.988281 C 20.003906 14.960938 20.019531 14.9375 20.035156 14.917969 C 20.042969 14.929688 20.050781 14.941406 20.058594 14.957031 L 22.175781 18.546875 L 24.09375 19.035156 Z "></path>
        <path style=" fill:#4788C7;" d="M 15.15625 23.183594 L 17.058594 19.871094 L 16.5625 18.042969 L 14.628906 18.476563 L 12.734375 21.777344 C 12.144531 22.785156 12.078125 23.84375 12.554688 24.679688 C 13.035156 25.519531 13.976563 26 15.140625 26 L 18.59375 26 L 17.59375 24.601563 L 18.59375 23.199219 L 15.148438 23.199219 C 15.148438 23.195313 15.152344 23.191406 15.15625 23.183594 Z "></path>
        </g>
        </svg>`,
        name: "Recycle Bin",
        tags: ["trash"],
    },
];
