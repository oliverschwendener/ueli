import { executeCommand } from "./command-executor";

export function executeFilePathWindows(filePath: string, privileged: boolean): Promise<void> {
    const command: string = privileged ?
        `powershell -Command "& {Start-Process -Verb runas '${filePath}'}"` :
        `powershell -Command "& {Start-Process '${filePath}'}"`;

    return executeCommand(command);
}

export function executeFilePathMacOs(filePath: string, privileged: boolean): Promise<void> {
    const command: string = privileged ?
        `osascript -e 'do shell script "open \\"${filePath}\\"" with administrator privileges"'` :
        `osascript -e 'do shell script "open \\"${filePath}\\""'`;

    return executeCommand(command);
}
