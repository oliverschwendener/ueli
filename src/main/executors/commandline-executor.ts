import { executeCommand } from "./command-executor";
import { MacOsShell, WindowsShell } from "../plugins/commandline-plugin/shells";

const unsupportedShellRejection = (shell: WindowsShell|MacOsShell) => {
    return Promise.reject(`Unsupported shell: ${shell.toString()}`);
};

export const macOsCommandLineExecutor = (command: string, exit: boolean, shell: MacOsShell): Promise<void> => {
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
        default:
            return unsupportedShellRejection(shell);
    }

    return executeCommand(`osascript -e '${osaScript}'`);
};

export const windowsCommandLineExecutor = (command: string, exit: boolean, shell: WindowsShell): Promise<void> => {
    switch (shell) {
        case WindowsShell.WSL:
            return executeCommand(`start wsl.exe sh -c "${command}; exec $SHELL;${exit ? ";exit" : ""}"`);
        case WindowsShell.PowerShellCore:
            return executeCommand(`start pwsh.exe ${exit ? "" : " -NoExit"} -Command "&${command}"`);
        case WindowsShell.Powershell:
            return executeCommand(`start powershell ${exit ? "" : " -NoExit"} -Command "&${command}"`);
        case WindowsShell.Cmd:
            return executeCommand(`start cmd.exe /k "${command} ${exit ? "&exit" : ""}`);
        default:
            return unsupportedShellRejection(shell);
    }
};
