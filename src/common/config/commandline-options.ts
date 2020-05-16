import { isWindows } from "../helpers/operating-system-helpers";
import { platform } from "os";
import { WindowsShell, MacOsShell } from "../../main/plugins/commandline-plugin/shells";

export interface CommandlineOptions {
    isEnabled: boolean;
    prefix: string;
    shell: WindowsShell|MacOsShell;
    closeAfterExecution: boolean;
}

const defaultMacOsCommandlineOptions: CommandlineOptions = {
    isEnabled: true,
    prefix: ">",
    shell: MacOsShell.Terminal,
    closeAfterExecution: false,
};

const defaultWindowsCommandlineOptions: CommandlineOptions = {
    isEnabled: true,
    prefix: ">",
    shell: WindowsShell.Cmd,
    closeAfterExecution: false,
};

export const defaultCommandlineOptions: CommandlineOptions = isWindows(platform())
    ? defaultWindowsCommandlineOptions
    : defaultMacOsCommandlineOptions;
