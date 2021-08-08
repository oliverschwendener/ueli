import { getCurrentOperatingSystem } from "../helpers/operating-system-helpers";
import { platform } from "os";
import { WindowsShell, MacOsShell, LinuxShell } from "../../main/plugins/commandline-plugin/shells";
import { OperatingSystem } from "../operating-system";

export interface CommandlineOptions {
    isEnabled: boolean;
    prefix: string;
    shell: WindowsShell | MacOsShell | LinuxShell;
}

const defaultMacOsCommandlineOptions: CommandlineOptions = {
    isEnabled: true,
    prefix: ">",
    shell: MacOsShell.Terminal,
};

const defaultWindowsCommandlineOptions: CommandlineOptions = {
    isEnabled: true,
    prefix: ">",
    shell: WindowsShell.Cmd,
};

const defaultLinuxCommandlineOptions: CommandlineOptions = {
    isEnabled: true,
    prefix: ">",
    shell: LinuxShell.GnomeTerminal,
}

const defaultCommandlineOptionsMapping = {
    [OperatingSystem.Windows]: defaultWindowsCommandlineOptions,
    [OperatingSystem.Linux]: defaultLinuxCommandlineOptions,
    [OperatingSystem.macOS]: defaultMacOsCommandlineOptions,
}

const currentOs = getCurrentOperatingSystem(platform());
// const currentOsVersion = getCurrentOperatingSystemVersion(currentOs, release())

export const defaultCommandlineOptions: CommandlineOptions =
    defaultCommandlineOptionsMapping[currentOs]
