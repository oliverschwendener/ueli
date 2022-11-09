import { getCurrentOperatingSystem } from "../helpers/operating-system-helpers";
import { platform } from "os";
import { MacOsShell, WindowsShell } from "../../main/plugins/commandline-plugin/shells";
import { OperatingSystem } from "../operating-system";

export interface CommandlineOptions {
    isEnabled: boolean;
    isCustom: boolean;
    prefix: string;
    shell: WindowsShell | MacOsShell;
    customShell: string;
    customShellFlags: string;
}

const defaultMacOsCommandlineOptions: CommandlineOptions = {
    isEnabled: true,
    isCustom: false,
    prefix: ">",
    shell: MacOsShell.Terminal,
    customShell: '',
    customShellFlags: ''
};

const defaultWindowsCommandlineOptions: CommandlineOptions = {
    isEnabled: true,
    isCustom: false,
    prefix: ">",
    shell: WindowsShell.Cmd,
    customShell: '',
    customShellFlags: ''
};

export const defaultCommandlineOptions: CommandlineOptions =
    getCurrentOperatingSystem(platform()) === OperatingSystem.Windows
        ? defaultWindowsCommandlineOptions
        : defaultMacOsCommandlineOptions;
