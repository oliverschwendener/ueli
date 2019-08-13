import { executeFilePathMacOs } from "./file-path-executor";
import { executeCommand } from "./command-executor";

export function executeMacOSOperatingSystemSetting(executionArgument: string): Promise<void> {
    return executeFilePathMacOs(executionArgument, false);
}

export function executeWindowsOperatingSystemSetting(executionArgument: string): Promise<void> {
    return executeCommand(`start ${executionArgument}`);
}
