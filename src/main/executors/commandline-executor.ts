import { executeCommand } from "./command-executor";
import { MacOsShell, WindowsShell, LinuxShell } from "../plugins/commandline-plugin/shells";

const unsupportedShellRejection = (shell: WindowsShell | MacOsShell | LinuxShell) => {
    return Promise.reject(`Unsupported shell: ${shell.toString()}`);
};

export const macOsCommandLineExecutor = (command: string, shell: MacOsShell): Promise<void> => {
    let osaScript: string;
    switch (shell) {
        case MacOsShell.Terminal:
            osaScript = `
                tell application "Terminal"
                    if not (exists window 1) then reopen
                        activate
                    do script "${command}" in window 1
                end tell
                `;
            break;
        case MacOsShell.iTerm:
            osaScript = `
                tell application "iTerm"
                    if not (exists window 1) then
                        reopen
                    else
                        tell current window
                            create tab with default profile
                        end tell
                    end if

                    activate

                    tell first session of current tab of current window
                        write text "${command}"
                    end tell
                end tell
                `;
            break;
        default:
            return unsupportedShellRejection(shell);
    }

    return executeCommand(`osascript -e '${osaScript}'`);
};

export const windowsCommandLineExecutor = (command: string, shell: WindowsShell): Promise<void> => {
    switch (shell) {
        case WindowsShell.WSL:
            return executeCommand(`start wsl.exe sh -c "${command}; exec $SHELL"`);
        case WindowsShell.PowerShellCore:
            return executeCommand(`start pwsh.exe -NoExit -Command "&${command}"`);
        case WindowsShell.Powershell:
            return executeCommand(`start powershell -NoExit -Command "&${command}"`);
        case WindowsShell.Cmd:
            return executeCommand(`start cmd.exe /k "${command}"`);
        case WindowsShell.PowerShellInWT:
            return executeCommand(`start wt.exe powershell -NoExit -Command "&${command}"`);
        case WindowsShell.WSLInWT:
            return executeCommand(`start wt.exe wsl sh -c "${command} && exec $SHELL"`);
        default:
            return unsupportedShellRejection(shell);
    }
};

export const linuxCommandLineExecutor = (command: string, shell: LinuxShell): Promise<void> => {
    switch (shell) {
        case LinuxShell.GnomeTerminal:
            return executeCommand(`gnome-terminal -- $SHELL -c "${command}; exec $SHELL"`);
        case LinuxShell.Alacritty:
            return executeCommand(`alacritty -e $SHELL -c "${command}; exec $SHELL"`);
        // This will not keep a shell open. Use only for silent execution.
        case LinuxShell.Bash:
            return executeCommand(`bash -c "${command}"`)
        default:
            return unsupportedShellRejection(shell);
    }
}
