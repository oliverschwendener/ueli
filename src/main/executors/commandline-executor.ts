import { executeCommand, executeWindowsCommand } from "./command-executor";
import { MacOsShell, WindowsShell } from "../plugins/commandline-plugin/shells";

const unsupportedShellRejection = (shell: WindowsShell | MacOsShell) => {
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
            return executeWindowsCommand(`start wsl.exe sh -c "${command}; exec $SHELL"`);
        case WindowsShell.PowerShellCore:
            return executeWindowsCommand(`start pwsh.exe -NoExit -Command "&${command}"`);
        case WindowsShell.Powershell:
            return executeWindowsCommand(`start powershell -NoExit -Command "&${command}"`);
        case WindowsShell.Cmd:
            return executeWindowsCommand(`start cmd.exe /k "${command}"`);
        case WindowsShell.PowerShellInWT:
            return executeWindowsCommand(`start wt.exe powershell -NoExit -Command "&${command}"`);
        case WindowsShell.WSLInWT:
            return executeWindowsCommand(`start wt.exe wsl sh -c "${command} && exec $SHELL"`);
        default:
            return unsupportedShellRejection(shell);
    }
};
