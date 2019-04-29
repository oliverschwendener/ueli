import { executeCommand } from "./command-executor";

export const macOsCommandLineExecutor = (command: string): Promise<void> => {
    const osaScript = `
        tell application "Terminal"
            if not (exists window 1) then reopen
                activate
            do script "${command}" in window 1
        end tell
        `;
    return executeCommand(`osascript -e '${osaScript}'`);
};

export const windowsCommandLineExecutor = (command: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        reject("not implemented");
    });
};
